#!/bin/bash
# Sincroniza o Megabrain MeuFluxo com o GitHub e reinstala os comandos globais.
# Uso: bash ~/.claude/sync-megabrain.sh
set -e

PROJ="$HOME/megabrain-meufluxo"
CMD="$HOME/.claude/commands"

cd "$PROJ"
git pull --ff-only

for c in copymf pesquisamf fabrica; do
  sed "s|^- \`PROJ\` = diretório do projeto Megabrain MeuFluxo (cwd atual deve ser ele).|- \`PROJ\` = \`$PROJ\` (caminho absoluto do projeto Megabrain MeuFluxo — este comando roda de qualquer diretório; o cwd é irrelevante, sempre use \`\$PROJ\`).|" \
    "$PROJ/.claude/commands/$c.md" > "$CMD/$c.md"
  echo "atualizado: $CMD/$c.md"
done

# skills do repo que não existem globalmente entram como symlink
for s in "$PROJ/.claude/skills"/*/; do
  name=$(basename "$s")
  [ -e "$HOME/.claude/skills/$name" ] || ln -sfn "$s" "$HOME/.claude/skills/$name"
done

echo "sync concluído."
