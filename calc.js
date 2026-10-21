// Another Crab's Treasure stat math. Isomorphic: runs in the browser (attached to
// window.ACTCALC) and under Node for the headless tests (module.exports).
//
// Qualitative stat roles (ATK = physical strike damage, VIT = max HP, RES = shell/incoming
// damage reduction, MSG = Umami/shell-spell ability damage) are corroborated across every
// source found (gameskinny.com, primagames.com, pcinvasion.com, dotesports.com, a Steam
// Community thread) — see README.md "Sources."
//
// The exact per-point magnitudes are NOT settled. The only source found with specific numbers
// for all four stats is a single site (astucejeuxps4.com); a Steam Community commenter
// independently estimated ATK's rate at roughly 5% per point, not 7%, and no second source was
// found for VIT or RES or MSG despite a dedicated search for each — see README.md. Per this
// lane's player-input fallback (used since GCT-011/GCT-020/GCT-016), none of the four rates are
// hardcoded as fact: all four are plain numeric arguments the page passes in from player-editable
// fields, pre-filled with the single-sourced estimate and labeled unconfirmed on the page itself.
// This file only encodes the arithmetic relationship, never asserts a rate.
(function (root) {
  "use strict";

  // Max HP = base HP (read off the player's own character sheet) + VIT points * HP-per-point.
  function projectedMaxHP(baseHP, vitPoints, vitRatePerPoint) {
    var base = Math.max(0, Number(baseHP) || 0);
    var pts = Math.max(0, Number(vitPoints) || 0);
    var rate = Number(vitRatePerPoint) || 0;
    return base + pts * rate;
  }

  // Physical strike damage multiplier = 1 + (ATK points * percent-per-point / 100).
  function physicalDamageMultiplier(atkPoints, atkRatePercentPerPoint) {
    var pts = Math.max(0, Number(atkPoints) || 0);
    var rate = Number(atkRatePercentPerPoint) || 0;
    return 1 + (pts * rate) / 100;
  }

  // Umami/shell-spell ability damage multiplier = 1 + (MSG points * percent-per-point / 100).
  function umamiDamageMultiplier(msgPoints, msgRatePercentPerPoint) {
    var pts = Math.max(0, Number(msgPoints) || 0);
    var rate = Number(msgRatePercentPerPoint) || 0;
    return 1 + (pts * rate) / 100;
  }

  // Shell/incoming damage reduction = RES points * flat-reduction-per-point.
  function shellDamageReduction(resPoints, resRatePerPoint) {
    var pts = Math.max(0, Number(resPoints) || 0);
    var rate = Number(resRatePerPoint) || 0;
    return pts * rate;
  }

  var api = {
    projectedMaxHP: projectedMaxHP,
    physicalDamageMultiplier: physicalDamageMultiplier,
    umamiDamageMultiplier: umamiDamageMultiplier,
    shellDamageReduction: shellDamageReduction
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.ACTCALC = api;
  }
})(typeof window !== "undefined" ? window : this);
