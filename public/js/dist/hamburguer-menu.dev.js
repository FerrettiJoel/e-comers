"use strict";

var d = document;

function hamburguerMenu(panelBtn, panel, menuLink) {
  d.addEventListener("click", function (e) {
    if (e.target.matches(panelBtn) || e.target.matches("".concat(panelBtn))) {
      d.querySelector(panel).classList.toggle("is-active");
      d.querySelector(panelBtn).classList.toggle("is-active");
    }

    if (e.target.matches(menuLink)) {
      d.querySelector(panel).classList.remove("is-active");
      d.querySelector(panelBtn).classList.remove("is-active");
    }
  });
}

addEventListener("DOMContentLoaded", function (e) {
  hamburguerMenu(".panel-btn", ".panel", ".menu a");
});