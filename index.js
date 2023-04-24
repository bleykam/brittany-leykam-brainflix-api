const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const cors = require("cors");
const { CORS_ORIGIN } = process.env;
const port = process.env.PORT || process.argv[2] || 8080;
const { v4 } = require("uuid");
const fs = require("fs");
const uploadRoutes = require("./routes/upload");
const commentRoutes = require("./routes/comments");

//Read the entire database and parse into a Javascript object;
let videos = JSON.parse(fs.readFileSync("./data/videos.json"));

app.use(express.json());
app.use(express.static("public"));
app.use(cors({ origin: CORS_ORIGIN }));
app.listen(port, () => console.log(`Listening on ${port}`));

app.use("/upload", uploadRoutes);
app.use("/comments", commentRoutes);
app.use(cors({ origin: "*" }));

app.use((req, res, next) => {
  if (
    req.method === "POST" &&
    req.headers["content-type"] !== "application/json"
  ) {
    res.status(400).send("Server requires application/json");
  } else {
    next();
  }
});

app.use((req, res, next) => {
  console.log(
    `Received a ${req.method} request for ${req.url}, `
  );
  next();
});

app.get("/", (req, res) => {
  res.send("WORKING!");
});

app.get("/videos", (req, res) => {
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

app.get("/videos/:id", (req, res) => {
  const videoId = req.params.id; // Get the video ID from the request parameters
  // Lookup the video in the database or file system
  const video = videos.find((video) => video.id === videoId);

  if (!video) {
    // If the video doesn't exist, send a 404 response
    res.status(404).send("Video not found");
  } else {
    // If the video exists, send it as the response
    res.json(video);
  }
});

function getVideos() {
  const videosFile = fs.readFileSync("./data/videos.json");
  const videos = JSON.parse(videosFile);
  return videos;
}
