import Express, { Request, RequestHandler, Response } from "express";
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: RequestHandler) => {
  console.error(err.stack);
  return res.status(500).send("Something broke!");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
