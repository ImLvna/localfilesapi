import { existsSync } from "fs";
import { readFile } from "fs/promises";
import MP3Tag from "mp3tag.js";

interface Tags {
  name?: string;
  album?: string;
  artist?: string;
}

export async function getMP3(fileName: string): Promise<MP3Tag> {
  if (!existsSync(`songs/${fileName}`)) throw new Error("File not found");
  const buf = await readFile(`songs/${fileName}`);
  const mp3 = new MP3Tag(buf);
  mp3.read();
  return mp3;
}

export function getTags(mp3: MP3Tag): Tags {
  return {
    name: mp3.tags.title,
    album: mp3.tags.album,
    artist: mp3.tags.artist,
  };
}

// Returns format, buffer
export function getImage(mp3: MP3Tag): [string, Buffer] | null {
  if (!mp3.tags.v2?.APIC?.length) return null;

  const { format, data } = mp3.tags.v2.APIC[0];
  // Data to buffer
  const buffer = Buffer.from(data);

  return [format, buffer];
}
