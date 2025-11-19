const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/download", async (req, res) => {
    const { query } = req.body;
    if (!query) return res.status(400).send("query required");

    const output = `audio_${Date.now()}.mp3`;
    const cmd = `yt-dlp -x --audio-format mp3 -o ${output} "${query}"`;

    exec(cmd, (err) => {
        if (err) return res.status(500).send("Indirme hatasi");

        const filePath = path.join(__dirname, output);
        const fileStream = fs.createReadStream(filePath);

        res.setHeader("Content-Type", "audio/mpeg");
        fileStream.pipe(res);

        fileStream.on("close", () => fs.unlinkSync(filePath));
    });
});

app.listen(3000, () => console.log("API çalışıyor: http://localhost:3000"));
