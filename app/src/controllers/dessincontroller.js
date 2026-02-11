const modeldessin = require("../models/modeldessin");
const path = require("path");

function normalizeTags(input) {
  if (!input) return [];
  return input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

async function index(req, res, next) {
  try {
    const type = req.query.type || "";

    const dessins = await modeldessin.getAll({ type: type || undefined });

    const all = await modeldessin.getAll();
    const types = [...new Set(all.map((d) => d.type).filter(Boolean))].sort();

    res.render("dessin/index", {
      pageTitle: "Portfolio",
      dessins,
      types,
      selectedtype: type,
    });
  } catch (err) {
    next(err);
  }
}

async function show(req, res, next) {
  try {
    const dessin = await modeldessin.getById(req.params.id);
    if (!dessin) {
      return res.status(404).render("error", {
        pageTitle: "Introuvable",
        message: "Dessin introuvable.",
      });
    }
    res.render("dessin/show", { pageTitle: dessin.title, dessin });
  } catch (err) {
    next(err);
  }
}

function newForm(req, res) {
  res.render("dessin/new", {
    pageTitle: "Ajouter un dessin",
    errors: [],
    values: { title: "", type: "", createdAt: "", tags: "", image: "" }
  });
}


async function create(req, res, next) {
  try {
    const { title, type, tags, createdAt, image } = req.body;

    const errors = [];
    if (!title || title.trim().length < 1) errors.push("Titre obligatoire.");
    if (!type || type.trim().length < 1) errors.push("Type obligatoire.");

    let imageUrl = "";
    if (image && image.trim()) {
      const raw = image.trim();
      if (raw.startsWith("/uploads/")) {
        imageUrl = raw;
      } else {
        const filename = path.basename(raw);
        imageUrl = `/uploads/${filename}`;
      }
    }

    if (errors.length) {
      return res.status(400).render("dessin/new", {
        pageTitle: "Ajouter",
        errors,
        values: {
          title: title || "",
          type: type || "",
          createdAt: createdAt || "",
          tags: tags || "",
          image: image || ""
        }
      });
    }

    const created = await modeldessin.create({
      title: title.trim(),
      type: type.trim(),
      tags: normalizeTags(tags),
      createdAt: createdAt && createdAt.trim() ? createdAt.trim() : undefined,
      image: imageUrl
    });

    res.redirect(`/dessin/${created.id}`);
  } catch (err) {
    next(err);
  }
}

async function destroy(req, res, next) {
  try {
    const removed = await modeldessin.removeById(req.params.id);

    console.log("DELETE:", req.params.id, "->", removed ? "OK" : "NOT FOUND");

    if (!removed) {
      return res.status(404).render("error", {
        pageTitle: "Introuvable",
        message: "Dessin introuvable."
      });
    }

    res.redirect("/dessin");
  } catch (err) {
    next(err);
  }
}

module.exports = { index, show, newForm, create, destroy };