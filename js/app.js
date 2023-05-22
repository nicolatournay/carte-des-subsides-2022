const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('../data'));

app.listen(port, () => {
    console.log(`Serveur écoutant sur le port ${port}`);
});


// Chemin vers beneficaires.json : http://localhost:3000/beneficiaires.json
// Dans le terminal : cd js ==> node app.js