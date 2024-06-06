const d = document;
function contactform( ){
    const $form = d.querySelector(".contact-form"),
    $inputs = d.querySelectorAll(".contact-form [required]")

    $inputs.forEach((input)=>{
        const $span = d.createElement("span");
        $span.id = input.name;
        $span.textContent = input.title;
        $span.classList.add("contact-form-error", "none");
        input.insertAdjacentElement("afterend", $span);
    });

    d.addEventListener("keyup",(e)=>{
        if(e.target.matches(".contact-form [required]")){
            let $inputs = e.target,
            pattern = $inputs.pattern || $inputs.dataset.pattern;

            if(pattern && $inputs.value !== ""){
                let regex = new RegExp(pattern);
                return !regex.exec($inputs.value)
                    ?d.getElementById($inputs.name).classList.add("is-active")
                    :d.getElementById($inputs.name).classList.remove("is-active");
            }

            if(!pattern){
                return $inputs.value === ""
                    ?d.getElementById($inputs.name).classList.add("is-active")
                    :d.getElementById($inputs.name).classList.remove("is-active");
            }
        }
    })

    d.addEventListener("submit", (e)=>{
        e.preventDefault();
        alert("Enviando Formulario");
        
        const $loader = d.querySelector(".contact-form-loader"),
            $response = d.querySelector(".contact-form-response");

        $loader.classList.remove("none");
        
        // fetch("https://formsubmit.co/ajax/7a745a3ca7a4114cff036f2145ef5a7e", {
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
            

        setTimeout(()=>{
            $loader.classList.add("none");
            $response.classList.remove("none");
            $form.reset();

            setTimeout(()=> $response.classList.add("none"), 3000);
        }, 3000);
    });
}   

d.addEventListener("DOMContentLoaded", contactform)