// implement your server here
// require your posts router and connect it here
const express = require("express");
const server = express();
const postRouter = require("./posts/posts-router");

server.use(express.json());
server.use(postRouter);

module.exports = server;
