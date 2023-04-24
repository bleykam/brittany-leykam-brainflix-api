const express = require("express");
const router = express.Router();
const fs = require('node:fs');
const { v4 } = require("uuid");
const cors = require("cors");
router.use(cors({ origin: '*' }));

router.use((req, res, next) => {
  console.log(`Received a ${req.method} request for ${req.url}`);
  next()
})

router.get("/", (req, res) => {
  const comments = getComments();
  res.json(comments);
});

router.post("/", (req, res) => {
  const { id, comment } = req.body;
  const database = getComments();

  const newComment = {
    id: v4(),
    name: "Godzilla",
    comment,
    likes: 0,
    timestamp: Date.now(),
  };

  database.map((video) => {
    if (video.id === id) {
      return video.comments.push(newComment);
    }
  });

  fs.writeFileSync("./database.json", JSON.stringify(database));
  res.send("Created New Comment");
});

function getComments() {
  const commentsFile = fs.readFileSync("./database.json");
  const comments = JSON.parse(commentsFile);
  return comments;
}

function validator(req, res, next) {
  console.log("hi from inline middleware");
  const { title, description } = req.body;
  if (!title || !description) {
    res.status(400).send("need an user and comment");
  } else {
    next();
  }
}


module.exports = router;

