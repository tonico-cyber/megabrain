#!/usr/bin/env python3
"""Runner genérico da Apify para o /pesquisamf — com travas de custo.

Uso:
  python3 apify_run.py <actor-id> <input.json> [--out saida.json] [--timeout 600]
                       [--max-cost 0.30] [--budget-ceiling 4.50] [--memory 512]

  <actor-id>   ex: curious_coder/facebook-ads-library-scraper
  <input.json> caminho do arquivo de input do actor (JSON)

Comportamento e travas (plano FREE = US$ 5/mês):
  1. Token: APIFY_TOKEN no ambiente, ou no .env ao lado de bin/ (APIFY_TOKEN=...).
  2. TRAVA DE ORÇAMENTO (fail-closed): consulta o uso mensal ANTES de rodar; se já passou
     de --budget-ceiling, ou se o endpoint mudar de formato, ABORTA sem gastar.
  3. O run é criado com timeout NO SERVIDOR (= --timeout): mesmo que este script morra,
     a Apify mata o run sozinha.
  4. Polling com retry; em erro fatal ou Ctrl-C, tenta abortar o run antes de sair.
  5. TRAVA DE RUN (melhor esforço): aborta o run se o custo reportado passar de --max-cost.
     O custo pode ser creditado em lotes — trate como proteção, não como precisão.
  6. Baixa os itens do dataset para --out (cria diretórios se preciso) e reporta o custo.
"""
import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request

API = "https://api.apify.com/v2"
TOKEN = None


def die(msg, code=1):
    print(f"[apify_run] ERRO: {msg}", file=sys.stderr)
    sys.exit(code)


def req(method, path, body=None, retries=3, raw=False):
    """Chamada à API com token no header e retry com backoff em erro transitório."""
    url = path if path.startswith("http") else API + path
    data = json.dumps(body).encode() if body is not None else None
    last = None
    for attempt in range(retries):
        r = urllib.request.Request(url, data=data, method=method, headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN}",
        })
        try:
            with urllib.request.urlopen(r, timeout=60) as resp:
                payload = resp.read()
                return payload if raw else json.loads(payload or "{}")
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504) and attempt < retries - 1:
                last = e
                time.sleep(3 * (attempt + 1))
                continue
            detail = ""
            try:
                detail = e.read().decode()[:300]
            except Exception:
                pass
            raise RuntimeError(f"HTTP {e.code} em {method} {url.split('?')[0]}: {detail}") from e
        except (urllib.error.URLError, TimeoutError) as e:
            if attempt < retries - 1:
                last = e
                time.sleep(3 * (attempt + 1))
                continue
            raise RuntimeError(f"falha de rede em {method} {url.split('?')[0]}: {e}") from e
    raise RuntimeError(f"esgotou retries: {last}")


def load_token():
    tok = os.environ.get("APIFY_TOKEN")
    if tok:
        return tok
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env")
    if os.path.exists(env_path):
        for line in open(env_path):
            line = line.strip()
            if line.startswith("export "):
                line = line[len("export "):]
            if line.startswith("APIFY_TOKEN="):
                val = line.split("=", 1)[1].split(" #")[0].strip().strip('"').strip("'")
                if val:
                    return val
    die("token não encontrado: defina APIFY_TOKEN ou crie copymf/pesquisa/.env")


def monthly_usage():
    """Uso mensal em US$. FAIL-CLOSED: formato desconhecido → aborta."""
    d = req("GET", "/users/me/usage/monthly")["data"]
    total = d.get("totalUsageCreditsUsdAfterVolumeDiscount")
    if total is None:
        svc = d.get("monthlyServiceUsage")
        if isinstance(svc, dict) and svc:
            total = sum(v.get("totalUsageCreditsUsd", 0) for v in svc.values())
    if total is None:
        die("não consegui ler o uso mensal (formato do endpoint mudou?) — abortando por segurança")
    return float(total)


def abort_run(run_id):
    try:
        req("POST", f"/actor-runs/{run_id}/abort", retries=2)
        print(f"[apify_run] run {run_id} abortado no servidor", file=sys.stderr)
    except Exception as e:
        print(f"[apify_run] AVISO: falha ao abortar {run_id} ({e}) — o timeout do servidor "
              f"encerra o run sozinho; confira em console.apify.com", file=sys.stderr)


def main():
    global TOKEN
    ap = argparse.ArgumentParser(add_help=True)
    ap.add_argument("actor", help="ex: curious_coder/facebook-ads-library-scraper")
    ap.add_argument("input", help="arquivo JSON de input do actor")
    ap.add_argument("--out", default=None, help="arquivo de saída (default: stdout)")
    ap.add_argument("--timeout", type=int, default=600, help="timeout em s (aplicado também no servidor)")
    ap.add_argument("--max-cost", type=float, default=0.30, dest="max_cost")
    ap.add_argument("--budget-ceiling", type=float, default=4.50, dest="ceiling")
    ap.add_argument("--memory", type=int, default=512,
                    help="MB; vários actors exigem memória proporcional ao input (512 p/ runs frugais)")
    args = ap.parse_args()

    actor = args.actor.replace("/", "~")
    TOKEN = load_token()

    if args.out:
        outdir = os.path.dirname(os.path.abspath(args.out))
        os.makedirs(outdir, exist_ok=True)

    used = monthly_usage()
    print(f"[apify_run] uso mensal atual: US$ {used:.3f} (teto: US$ {args.ceiling:.2f})", file=sys.stderr)
    if used >= args.ceiling:
        die(f"orçamento mensal estourado (US$ {used:.2f} >= US$ {args.ceiling:.2f}). Não vou rodar.")

    try:
        actor_input = json.load(open(args.input))
    except (OSError, json.JSONDecodeError) as e:
        die(f"input inválido ({args.input}): {e}")

    run = req("POST", f"/acts/{actor}/runs?memory={args.memory}&timeout={args.timeout}",
              actor_input)["data"]
    run_id = run["id"]
    print(f"[apify_run] run {run_id} iniciado ({args.actor}, timeout servidor {args.timeout}s)",
          file=sys.stderr)

    t0 = time.time()
    status = run["status"]
    cost = 0.0
    try:
        while status in ("READY", "RUNNING", "TIMING-OUT", "ABORTING"):
            if time.time() - t0 > args.timeout + 60:
                abort_run(run_id)
                die(f"timeout local de {args.timeout}s excedido")
            time.sleep(5)
            run = req("GET", f"/actor-runs/{run_id}")["data"]
            status = run["status"]
            c = run.get("usageTotalUsd")
            if c is not None:
                cost = c
            if cost > args.max_cost:
                abort_run(run_id)
                die(f"custo do run (US$ {cost:.3f}) passou de --max-cost US$ {args.max_cost:.2f}")
    except KeyboardInterrupt:
        abort_run(run_id)
        die("interrompido pelo usuário — run abortado")
    except RuntimeError as e:
        abort_run(run_id)
        die(f"{e} — run abortado por segurança")

    cost = run.get("usageTotalUsd")
    if cost is None:
        print("[apify_run] AVISO: campo usageTotalUsd ausente — custo desconhecido, "
              "confira em console.apify.com", file=sys.stderr)
        cost = 0.0
    if status != "SUCCEEDED":
        die(f"run terminou com status {status} (custo US$ {cost:.3f}) — "
            f"log: {API}/logs/{run_id}")

    ds = run["defaultDatasetId"]
    items = req("GET", f"/datasets/{ds}/items?format=json&clean=true", raw=True)
    n = len(json.loads(items))
    if n == 0:
        print("[apify_run] AVISO: dataset vazio (0 itens)", file=sys.stderr)
    if args.out:
        open(args.out, "wb").write(items)
        print(f"[apify_run] OK: {n} itens salvos em {args.out} · custo US$ {cost:.3f}", file=sys.stderr)
    else:
        sys.stdout.buffer.write(items)
        print(f"[apify_run] OK: {n} itens · custo US$ {cost:.3f}", file=sys.stderr)


if __name__ == "__main__":
    main()
