import Express from "express";
import { getFileNames, mapSpotifyToFilePath } from "files";
import router from "routers/song";

export let spotifyToFile: Record<string, string> = {};
mapSpotifyToFilePath().then((data) => {
  spotifyToFile = data;
  console.log("Spotify to file mapping complete");
});

const app = Express();

app.use(Express.static("songs"));

app.get("/", (req, res) => {
  return res.json(getFileNames());
});

app.use(router);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
