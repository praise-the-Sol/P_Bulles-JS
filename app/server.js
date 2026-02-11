const express = require("express");
const path = require("path");

const indexroute = require("./src/routes/indexroute");
const dessinroute = require("./src/routes/dessinroute");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));

app.use("/", indexroute);
app.use("/dessin", dessinroute);

app.use((req, res) => {
  res.status(404).render("error", {
    pageTitle: "404",
    message: "404."
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("error", {
    pageTitle: "Erreur",
    message: "Pas UP"
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`UP sur localhost:${PORT}`));
