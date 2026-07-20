/**
 * report.js — relatório executivo.
 * Uso: tpl({ ast, meta, pageSize }) → docx Document
 *
 * Paleta: azul corporativo sóbrio.
 * Inclui cover + TOC + headers/footers paginados.
 */

const { buildDocument } = require("../scripts/generate");

module.exports = function reportTemplate({ ast, meta, pageSize = "A4" }) {
  const palette = {
    accent:     "1F3A5F", // azul-petróleo
    muted:      "555555",
    headerFill: "E8EEF7",
  };

  return buildDocument({
    ast,
    meta,
    pageSize,
    palette,
    fontFamily: "Aptos",
    includeCover: true,
    includeTOC: true,
  });
};
