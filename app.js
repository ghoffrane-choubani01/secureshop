const express = require("express");
const _ = require("lodash");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const db = new sqlite3.Database(":memory:");

const AWS_KEY = "AKIAZ3X7Q9PLM2WKD5TB"; // secret en clair (faux, pour la démo)

db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER, name TEXT, email TEXT)");
  db.run("INSERT INTO users VALUES (1, 'ali', 'ali@test.tn')");
});

app.get("/", (req, res) => res.send("SecureShop OK"));

app.get("/user", (req, res) => {
  // injection SQL
  const q = "SELECT * FROM users WHERE name = '" + req.query.name + "'";
  db.all(q, (err, rows) => res.json(rows || []));
});

app.get("/hello", (req, res) => {
  // XSS réfléchi
  res.send("<h1>Bonjour " + req.query.name + "</h1>");
});

app.get("/calc", (req, res) => {
  // eval sur entrée utilisateur
  res.send(String(eval(req.query.expr)));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => console.log("Listening on " + PORT));
