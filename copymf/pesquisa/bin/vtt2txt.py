#!/usr/bin/env python3
"""Converte legenda VTT (yt-dlp/YouTube) em texto corrido limpo.

Uso:  python3 vtt2txt.py arquivo.vtt [> roteiro.txt]

Par com o download gratuito de roteiro de vídeo do YouTube (sem Apify):
  uvx yt-dlp --skip-download --write-auto-subs --sub-langs "pt" \
      --sub-format vtt -o "video.%(ext)s" "https://www.youtube.com/watch?v=ID"
"""
import re
import sys

if len(sys.argv) < 2:
    sys.exit(__doc__)

lines = []
for l in open(sys.argv[1], encoding="utf-8"):
    l = l.strip()
    if not l or "-->" in l or l.startswith(("WEBVTT", "Kind:", "Language:")):
        continue
    l = re.sub(r"<[^>]+>", "", l)
    if lines and lines[-1] == l:  # dedupe do rolling caption
        continue
    lines.append(l)

print(" ".join(lines))
