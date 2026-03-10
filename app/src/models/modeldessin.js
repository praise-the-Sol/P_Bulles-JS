const { pool } = require("../db");

function makeId() {
  return "d_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
}

function parseTags(tagsText) {
  try { return JSON.parse(tagsText); } catch { return []; }
}

async function getAll({ type } = {}) {
  let rows;
  if (type) {
    [rows] = await pool.query(
      `SELECT id, title, type, tags,
              DATE_FORMAT(createdAt, '%Y-%m-%d') AS createdAt,
              (image IS NOT NULL) AS hasImage
       FROM dessins
       WHERE LOWER(type) = LOWER(?)
       ORDER BY createdAt DESC`,
      [type]
    );
  } else {
    [rows] = await pool.query(
      `SELECT id, title, type, tags,
              DATE_FORMAT(createdAt, '%Y-%m-%d') AS createdAt,
              (image IS NOT NULL) AS hasImage
       FROM dessins
       ORDER BY createdAt DESC`
    );
  }

  return rows.map(r => ({
    id: r.id,
    title: r.title,
    type: r.type,
    tags: parseTags(r.tags),
    createdAt: r.createdAt,
    hasImage: !!r.hasImage
  }));
}

async function getById(id) {
  const [rows] = await pool.query(
    `SELECT id, title, type, tags,
            DATE_FORMAT(createdAt, '%Y-%m-%d') AS createdAt,
            (image IS NOT NULL) AS hasImage
     FROM dessins
     WHERE id = ?`,
    [id]
  );
  const r = rows[0];
  if (!r) return null;

  return {
    id: r.id,
    title: r.title,
    type: r.type,
    tags: parseTags(r.tags),
    createdAt: r.createdAt,
    hasImage: !!r.hasImage
  };
}

async function create({ title, type, tags, createdAt, imageBuffer, imageMime, imageName }) {
  const id = makeId();
  const tagsText = JSON.stringify(Array.isArray(tags) ? tags : []);
  const date = createdAt || new Date().toISOString().slice(0, 10);

  await pool.query(
    `INSERT INTO dessins (id, title, type, tags, createdAt, image, imageMime, imageName)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, title, type, tagsText, date, imageBuffer || null, imageMime || null, imageName || null]
  );

  return { id };
}

async function removeById(id) {
  const [rows] = await pool.query(`SELECT id FROM dessins WHERE id = ?`, [id]);
  if (!rows[0]) return null;

  await pool.query(`DELETE FROM dessins WHERE id = ?`, [id]);
  return { id };
}

async function getImageById(id) {
  const [rows] = await pool.query(
    `SELECT image, imageMime FROM dessins WHERE id = ?`,
    [id]
  );
  const r = rows[0];
  if (!r || !r.image) return null;
  return { buffer: r.image, mime: r.imageMime || "application/octet-stream" };
}

module.exports = { getAll, getById, create, removeById, getImageById };