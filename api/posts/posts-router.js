// implement your posts router here
const Posts = require("./posts-model");
const express = require("express");
const router = express.Router();

router.get("/api/posts", (req, res) => {
  Posts.find()
    .then((posts) => {
      res.json(posts);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "The posts information could not be retrieved" });
    });
});

router.get("/api/posts/:id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (!post) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    }
    res.json(post);
  } catch (err) {
    res
      .status(500)
      .json({ message: "The post information could not be retrieved" });
  }
});

router.post("/api/posts", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Posts.insert({ title, contents })
      .then(({ id }) => {
        return Posts.findById(id);
      })
      .then((post) => {
        res.status(201).json(post);
      })
      .catch((err) => {
        res.status(500).json({
          message: "There was an error while saving the post to the database",
        });
      });
  }
});

router.put("/api/posts/:id", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Posts.findById(req.params.id).then((id) => {
      if (!id) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      } else {
        return Posts.update(req.params.id, { title, contents }).then((data) => {
          if (data) {
            return Posts.findById(req.params.id).then((post) => {
              res.json(post);
            });
          }
        });
      }
    });
  }
});

router.delete("/api/posts/:id", async (req, res) => {
  try {
    const find = await Posts.findById(req.params.id);
    if (!find) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
      await Posts.remove(req.params.id);
      res.json(find);
    }
  } catch (err) {
    res.status(500).json({ message: "The post could not be removed" });
  }
});

router.get("/api/posts/:id/comments", async (req, res) => {
  try {
    const comments = await Posts.findPostComments(req.params.id);
    const commentById = await Posts.findCommentById(req.params.id);
    if (!commentById) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
      res.json(comments);
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "The comments information could not be retrieved" });
  }
});

module.exports = router;
