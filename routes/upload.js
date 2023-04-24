const express = require("express");
const router = express.Router();
const fs = require("node:fs");
const { v4 } = require("uuid");
const cors = require("cors");
router.use(cors({ origin: "*" }));

router.use((req, res, next) => {
  console.log(
    `Received a ${req.method} request for ${req.url}, on UPLOAD PAGE Req: ${req.body}, Response ${res.body}`
  );
  console.log("Time: ", new Date(Date.now()).toLocaleString());
  next();
});

router.use(express.static("public"));

router.get("/", (req, res) => {
  const videos = getVideos();
  const short = videos.map((video) => {
    return {
      id: video.id,
      image: video.image,
      channel: video.channel,
      title: video.title,
    };
  });
  res.json(short);
});

router.post("/", validator, (req, res) => {
  const videos = getVideos();
  const { title, description, image } = req.body;

  const newVideo = {
    id: v4(),
    title,
    channel: "default channel",
    image,
    description,
    likes: 0,
    views: 0,
    duration: "0s",
    comments: [],
    timestamp: Date.now(),
  };

  videos.push(newVideo);
  fs.writeFileSync("./data/videos.json", JSON.stringify(videos));
  res.send("created new video");
});

function getVideos() {
  const videosFile = fs.readFileSync("./data/videos.json");
  const videos = JSON.parse(videosFile);
  return videos;
}

function validator(req, res, next) {
  console.log("hi from inline middleware");
  const { title, description } = req.body;
  if (!title || !description) {
    res.status(400).send("need an author and content");
  } else {
    next();
  }
}

module.exports = router;
