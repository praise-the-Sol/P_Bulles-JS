const fs = require("fs").promises;
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "..", "data", "dessin.json");

async function readAll() {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeAll(dessins) {
  await fs.writeFile(DATA_PATH, JSON.stringify(dessins, null, 2), "utf-8");
}

function makeId() {
  return "d_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
}

async function getAll({ type } = {}) {
  const dessins = await readAll();
  if (!type) return dessins;
  return dessins.filter(d => (d.type || "").toLowerCase() === type.toLowerCase());
}

async function getById(id) {
  const dessins = await readAll();
  return dessins.find(d => d.id === id) || null;
}

async function create({ title, type, tags, createdAt, image }) {
  const dessins = await readAll();

  const newDessin = {
    id: makeId(),
    title,
    type,
    tags: Array.isArray(tags) ? tags : [],
    createdAt: createdAt || new Date().toISOString().slice(0, 10),
    image: image || ""
  };

  dessins.unshift(newDessin);
  await writeAll(dessins);
  return newDessin;
}

async function removeById(id) {
  const dessins = await readAll();
  const index = dessins.findIndex(d => d.id === id);
  if (index === -1) return null;

  const [removed] = dessins.splice(index, 1);
  await writeAll(dessins);
  return removed;
}

module.exports = { getAll, getById, create, removeById };
