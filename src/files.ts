import { readdirSync } from "fs";
import { getMP3, getTags } from "./util";

const fileExtensions = ["mp3", "wav", "flac"];

export function getFileNames() {
  return readdirSync("./songs", { recursive: true })
    .filter((file) => {
      const extension = file.toString().split(".").pop();
      return fileExtensions.includes(extension || "");
    })
    .map((file) => file.toString().replace("./songs/", "").replace(/\\/g, "/"));
}

export async function pathToSpotifyUri(path: string) {
  const mp3 = await getMP3(path);
  const tags = await getTags(mp3);
  if (!tags.artist || !tags.album || !tags.name) {
    return null;
  }
  return `spotify:local:${tags.artist}:${tags.album}:${tags.name}`.replace(
    /\s/g,
    "+"
  ).replace(/\(/g, "%28").replace(/\)/g, "%29")
}

export async function mapSpotifyToFilePath() {
  const files = getFileNames();
  const mapped = await Promise.all(
    files.map(async (file) => {
      const uri = await pathToSpotifyUri(file);
      return { file, uri };
    })
  );
  return mapped
    .filter((x) => x.uri)
    .reduce(
      (acc, { file, uri }) => {
        acc[uri!] = file;
        return acc;
      },
      {} as Record<string, string>
    );
}
