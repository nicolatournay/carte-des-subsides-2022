const express = require('express');
const cors = require('cors');
const fs = require('fs');
const MarkdownIt = require('markdown-it');

const md = new MarkdownIt();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('../data'));

app.get('/content', (req, res) => {
    fs.readFile('./data/content.md', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send('Erreur lors de la lecture du fichier');
        } else {
            const result = md.render(data);
            res.send(`<div>${result}</div>`);
        }
    });
});  

app.listen(port, () => {
    console.log(`Serveur écoutant sur le port ${port}`);
});


// Chemin vers beneficaires.json : http://localhost:3000/beneficiaires.json
// Dans le terminal : cd js ==> node app.js