/**
 * ebook.js — e-book / manual / playbook (documento longo).
 * Cover + TOC + paginação. Paleta roxo editorial.
 * Tipografia maior para conforto de leitura.
 */

const { buildDocument } = require("../scripts/generate");

module.exports = function ebookTemplate({ ast, meta, pageSize = "A4" }) {
  const palette = {
    accent:     "4A2B5C", // roxo editorial
    muted:      "555555",
    headerFill: "EFE7F2",
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
