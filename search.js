const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/search", (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).send("query required");

  const cmd = `yt-dlp "ytsearch10:${query}" --skip-download --print-json`;

  exec(cmd, (err, stdout, stderr) => {
    if (err) return res.status(500).send(stderr);

    const videos = stdout
      .split("\n")
      .filter(line => line.trim() !== "")
      .map(line => JSON.parse(line))
      .map(video => ({
        title: video.title,
        url: video.webpage_url,
        channel: video.uploader,
        thumbnail: video.thumbnail
      }));

    res.json(videos);
  });
});

app.listen(3001, () => console.log("Search API çalışıyor: http://localhost:3001"));
