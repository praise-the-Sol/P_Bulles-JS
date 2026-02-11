function home(req, res) {
  res.render("home", { pageTitle: "Accueil" });
}

module.exports = { home };
