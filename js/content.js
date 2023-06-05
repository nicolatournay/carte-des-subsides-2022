export { getContent };

function getContent() {
    fetch('http://localhost:3000/content')
    .then(response => response.text())
    .then(data => {
        document.getElementById('content').innerHTML += data;
    });
}