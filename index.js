const express = require("express");
const server = express();
server.use(express.json());

const postsRouter = require("./hubs/postsRouter");
server.use("/api/posts", postsRouter);

server.get("/", (req, res) => {
  res.send(`<h1>idk what this is yet but i'm here hello</h1>`);
});

server.listen(4000, () => {
  console.log("\n*** Sevvev running on http://localhost:4000 ***\n");
});