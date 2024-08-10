'use server';

import filenamify from 'filenamify';
import { serverTimestamp } from './utils';
import ytdl from '@distube/ytdl-core';
import { PassThrough } from 'stream';
const ytSearch = require('youtube-sr').default;

// MAIN FUNCTIONS
export const downloadTrack = async (track: any, silent = true) => {
  try {
    if (!silent && track) {
      console.log(
        `[${serverTimestamp()}]: Downloading ${track.name} by ${
          track.artists[0].name
        }...`
      );
    }
    // Find and download YouTube video
    const id = await findYtId(track);
    console.log(`YoutubeID: https://youtube.com/watch?v=${id}`);
    let buffer = await downloadYT(id);
    // Create filename
    const filename =
      pathNamify(`${track.name} by ${track.artists[0].name}`) + '.m4a';

    console.log('downloadTrack() filename: ', filename);

    return { buffer, filename };
  } catch (error) {
    console.error(error);
  }
};

// SUB FUNCTIONS
const findYtId = async (track: any) => {
  try {
    console.log('trying fintYtId()');
    const query = `${track.name} by ${track.artists[0].name} official`;

    // Get search data
    const videos = await ytSearch.search(query, { limit: 3, type: 'video' });

    // Find closest to the track's duration
    let closestDuration = null;
    let closestVideoUrl = null;

    for (const video of videos) {
      // Check if duration is exact
      if (video.duration === track.duration_ms) {
        return video.id;
      }

      // Check if closest duration
      if (
        !closestDuration ||
        Math.abs(video.duration - track.duration_ms) <
          Math.abs(closestDuration - track.duration_ms)
      ) {
        closestDuration = video.duration;
        closestVideoUrl = video.id;
      }
    }

    return closestVideoUrl;
  } catch (error) {
    console.error(error);
  }
};

const downloadYT = async (id: string) => {
  try {
    console.log('trying downloadYT()');
    // Get info
    const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`);
    console.log('INFO');
    // Choose the highest quality audio format
    const audioFormat = ytdl.chooseFormat(info.formats, {
      quality: 'highestaudio',
    });
    console.log('audioFormat');

    // Get audio stream and process it
    const audioStream = ytdl.downloadFromInfo(info, { format: audioFormat });
    const buffer = streamToBuffer(audioStream);

    return buffer;
  } catch (error) {
    console.error(error);
  }
};

async function streamToBuffer(stream: any) {
  try {
    return new Promise((resolve, reject) => {
      const mp3Buffer: any = [];
      const outputStream = new PassThrough();
      outputStream.on("error", (err) => {
        reject(err);
      });
      outputStream.on("end", () => {
        const finalBuffer = Buffer.concat(mp3Buffer);
        resolve(finalBuffer);
      });

      stream.pipe(outputStream);
      outputStream.on("data", (chunk) => {
        mp3Buffer.push(chunk);
      });

      outputStream.on("error", (err) => {
        reject(err);
      });
    });
  } catch (error) {
    console.error(error);
  }
}

// UTIL FUNCTIONS
const pathNamify = (path: string) => {
  // @ts-ignore
  return filenamify(path).replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '');
};
