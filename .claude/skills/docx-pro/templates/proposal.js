/**
 * proposal.js — proposta comercial.
 * Cover + sumário + paginação. Paleta verde corporativo (confiança/dinheiro).
 */

const { buildDocument } = require("../scripts/generate");

module.exports = function proposalTemplate({ ast, meta, pageSize = "A4" }) {
  const palette = {
    accent:     "1F5F3A", // verde corporativo
    muted:      "555555",
    headerFill: "E8F4EC",
  };

  return buildDocument({
    ast,
    meta,
    pageSize,
    palette,
    fontFamily: "Calibri",
    includeCover: true,
    includeTOC: true,
  });
};
