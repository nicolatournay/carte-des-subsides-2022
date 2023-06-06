export { getContent };

function getContent() {
    fetch('http://localhost:3000/a-propos')
    .then(response => response.text())
    .then(data => {
        document.getElementById('content').innerHTML += data;
    });
    fetch('http://localhost:3000/contact')
    .then(response => response.text())
    .then(data => {
        document.querySelector('.contact-content').innerHTML += data;
    });
}