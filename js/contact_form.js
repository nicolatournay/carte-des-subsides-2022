export { contactForm };

function contactForm() {
    const contactForm = document.getElementById("form");
    contactForm.addEventListener("submit", formSubmit);
}

function formSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    fetch("https://getform.io/f/28d67ef2-8bd3-4f41-92f2-b1723cb919e9", {
        method: "POST",
        body: formData,
        headers: {
            "Accept": "application/json",
        },
    })
    .then(response => {
        if (response.ok) {
            document.querySelector(".contact").innerHTML = "<h2>Merci pour votre message !</h2>";
            e.target.querySelector("[type='email']").value = "";
            e.target.querySelector("[type='text']").value = "";
            e.target.querySelector("[name='message']").value = "";
        }
    }).catch(error => {
        // affiche un message d'excuse dans l'élément soeur précédant le formulaire
        console.log(error);
        e.target.previousElementSibling.innerText = "Désolé. Une erreur est survenue, veuillez réessayer plus tard.";
    })
}
