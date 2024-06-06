"use strict";

var d = document;

function contactform() {
  var $form = d.querySelector(".contact-form"),
      $inputs = d.querySelectorAll(".contact-form [required]");
  $inputs.forEach(function (input) {
    var $span = d.createElement("span");
    $span.id = input.name;
    $span.textContent = input.title;
    $span.classList.add("contact-form-error", "none");
    input.insertAdjacentElement("afterend", $span);
  });
  d.addEventListener("keyup", function (e) {
    if (e.target.matches(".contact-form [required]")) {
      var _$inputs = e.target,
          pattern = _$inputs.pattern || _$inputs.dataset.pattern;

      if (pattern && _$inputs.value !== "") {
        var regex = new RegExp(pattern);
        return !regex.exec(_$inputs.value) ? d.getElementById(_$inputs.name).classList.add("is-active") : d.getElementById(_$inputs.name).classList.remove("is-active");
      }

      if (!pattern) {
        return _$inputs.value === "" ? d.getElementById(_$inputs.name).classList.add("is-active") : d.getElementById(_$inputs.name).classList.remove("is-active");
      }
    }
  });
  d.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Enviando Formulario");
    var $loader = d.querySelector(".contact-form-loader"),
        $response = d.querySelector(".contact-form-response");
    $loader.classList.remove("none"); // fetch("https://formsubmit.co/ajax/7a745a3ca7a4114cff036f2145ef5a7e", {
    //     method: "POST",
    //     body: new FormData(e.target)
    // })
    // .then(res=>res.ok ? res.json(): Promise.reject(res))
    // .then(json => {
    //     console.log(json);
    //     // $loader.classList.add("none");
    // $response.classList.remove("none");
    // $response.innerHTML = `<p>Mensaje enviado</p>
    //                        <p>Gracias por contactarte con Blanca Rossi</p>
    //                        <p>Recibiras una respuesta lo a la brebedad</p>                 `
    //     $form.reset();
    // })
    // .catch(err=>{
    //     console.log(err);
    //     // let message = err.statusText || "ocurrio un error al enviar, intenta nuevamente";
    //     // $response.innerHTML = `<p>Error ${err.status}: ${message}</p>`
    // })
    // .finally(() => 
    // setTimeout(()=> {
    //  $response.classList.add("none");
    // $response.innerHTML = "";
    // },3000));

    setTimeout(function () {
      $loader.classList.add("none");
      $response.classList.remove("none");
      $form.reset();
      setTimeout(function () {
        return $response.classList.add("none");
      }, 3000);
    }, 3000);
  });
}

d.addEventListener("DOMContentLoaded", contactform);