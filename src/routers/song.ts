import express from "express";
import { pathToSpotifyUri } from "files";
import { spotifyToFile } from "index";
import { getImage, getMP3, getTags } from "../util";

const router = express.Router();

router.get(/(spotify:local:[^:]*:[^:]*:[^:]*):\d+\/tags/, async (req, res) => {
  const spotifyUri = req.params[0];
  const fileName = spotifyToFile[spotifyUri];
  if (!fileName) return res.sendStatus(404);
  return res.redirect(`/${fileName}/tags`);
});

router.get(/\/([\w\W]*)\/tags/, async (req, res) => {
  const fileName = req.params[0];
  const mp3 = await getMP3(fileName);
  return res.json(getTags(mp3));
});

router.get(/(spotify:local:[^:]*:[^:]*:[^:]*):\d+\/image/, async (req, res) => {
  const spotifyUri = req.params[0];
  const fileName = spotifyToFile[spotifyUri];
  if (!fileName) return res.sendStatus(404);
  return res.redirect(`/${fileName}/image`);
});

router.get(/\/([\w\W]*)\/image/, async (req, res) => {
  const fileName = req.params[0];
  const mp3 = await getMP3(fileName);
  const data = getImage(mp3);
  if (!data) return res.sendStatus(404);
  const [format, buffer] = data;
  res.setHeader("Content-Type", format);
  return res.send(buffer);
});

router.get(/\/([\w\W]*)\/spotify/, async (req, res) => {
  const fileName = req.params[0];
  return res.send(await pathToSpotifyUri(fileName));
});

export default router;
