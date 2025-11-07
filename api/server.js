const express = require('express');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const app = express();
app.use(express.json());

// lowdb setup
const db = new Low(new JSONFile('db.json'), {});
(async () => {
  await db.read();
  db.data ||= {}; // empty DB → json-server starts with {}
  await db.write();
})();

// json-server defaults middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// timestamps middleware
app.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = req.body.updatedAt = new Date().toISOString();
  }
  if (req.method === 'PATCH' || req.method === 'PUT') {
    req.body.updatedAt = new Date().toISOString();
  }
  next();
});

// router: mimic json-server REST for every top-level key in db.json
app.use(async (req, res, next) => {
  await db.read();
  const url = req.url.split('?')[0];
  const parts = url.split('/').filter(Boolean);
  if (parts.length === 0) return next(); // skip root

  const resource = parts[0];
  const id = parts[1];
  const collection = db.data[resource] ||= [];

  // GET /resource
  if (req.method === 'GET' && !id) {
    return res.json(collection);
  }
  // GET /resource/:id
  if (req.method === 'GET' && id) {
    const item = collection.find(i => i.id == id);
    return item ? res.json(item) : res.sendStatus(404);
  }
  // POST /resource
  if (req.method === 'POST' && !id) {
    req.body.id = Date.now(); // json-server style ID
    collection.push(req.body);
    await db.write();
    return res.status(201).json(req.body);
  }
  // PUT /resource/:id
  if (req.method === 'PUT' && id) {
    const idx = collection.findIndex(i => i.id == id);
    if (idx === -1) return res.sendStatus(404);
    collection[idx] = { ...collection[idx], ...req.body, id: collection[idx].id };
    await db.write();
    return res.json(collection[idx]);
  }
  // PATCH /resource/:id
  if (req.method === 'PATCH' && id) {
    const idx = collection.findIndex(i => i.id == id);
    if (idx === -1) return res.sendStatus(404);
    collection[idx] = { ...collection[idx], ...req.body };
    await db.write();
    return res.json(collection[idx]);
  }
  // DELETE /resource/:id
  if (req.method === 'DELETE' && id) {
    const idx = collection.findIndex(i => i.id == id);
    if (idx === -1) return res.sendStatus(404);
    collection.splice(idx, 1);
    await db.write();
    return res.sendStatus(200);
  }
  next();
});

const PORT = 3001;
app.listen(PORT, () => console.log(`JSON Server is running on port ${PORT}`));