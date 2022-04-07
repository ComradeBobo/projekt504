const express = require("express");
const bodyParser = require('body-parser');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const app  = express();
const port = 3000;
const urlencodedParser = bodyParser.urlencoded({extended: false});
const csvtojson = require('csvtojson');


app.use(express.static("public"));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));


app.post('/savedata', urlencodedParser, (req, res) => {
    let date = moment().format('YYYY-MM-DD');
    let str = `"${req.body.player}","${req.body.points}","${date}"\n`;
    fs.appendFile(path.join(__dirname, 'data/results.csv'), str, function (err) {
    if (err) {
    console.error(err);
    return res.status(400).json({
    success: false,
    message: "Nastala chyba během ukládání souboru"
    });
    }
    });
    res.redirect(301, '/');
    });

app.get("/projekt504", (req, res) => {
    csvtojson({headers:['player','points','datum']}).fromFile(path.join(__dirname,
    'data/results.csv'))
    .then(data => {
    console.log(data);
    res.render('index', {nadpis: "Scoreboard", results: data});
    })
     .catch(err => {
    console.log(err);
    res.render('error', {nadpis: "Chyba v aplikaci", chyba: err});
    });
    });
    
    

app.listen(port, () => {
    console.log(`Server naslouchá na portu ${port}`);
});