/**
 * briefing.js — briefing de criativo (1-3 páginas, sem TOC).
 * Paleta laranja vibrante (urgência criativa).
 */

const { buildDocument } = require("../scripts/generate");

module.exports = function briefingTemplate({ ast, meta, pageSize = "A4" }) {
  const palette = {
    accent:     "C8541A", // laranja queimado
    muted:      "555555",
    headerFill: "FCE9DC",
  };

  return buildDocument({
    ast,
    meta,
    pageSize,
    palette,
    fontFamily: "Inter",
    includeCover: true,
    includeTOC: false, // briefings curtos não precisam de sumário
  });
};
