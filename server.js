const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Auto timestamp
server.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PATCH") {
    req.body.createdAt = new Date().toISOString();
  }
  next();
});

server.use(router);
server.listen(3001, () => {
  console.log("JSON Server running on http://localhost:3001");
});
