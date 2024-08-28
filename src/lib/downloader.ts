'use server';

import filenamify from 'filenamify';
import { serverTimestamp } from './utils';
import ytdl from '@distube/ytdl-core';
import { PassThrough } from 'stream';
import { Track } from '@/components/context/Download';
const ytSearch = require('youtube-sr').default;

// MAIN FUNCTIONS
export const downloadTrack = async (track: Track, silent = false) => {
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
    const buffer = await downloadYT(id);
    console.log(`${track.name}: https://www.youtube.com/watch?v=${id}`);
    // sanitize string to be valid for byte string conversion(valid filename)
    const sanitizeString = (str: string) => str.replace(/[^\x00-\x7F]/g, '');
    // Create filename
    const filename = sanitizeString(pathNamify(`${track.name}`) + '.m4a');

    return { buffer, filename };
  } catch (error) {
    console.error(error);
  }
};

// SUB FUNCTIONS
const findYtId = async (track: Track) => {
  try {
    let query = track.explicit
      ? `${track.name} ${track.artists[0].name} explicit official music -instrumental`
      : track.type === 'track' && track.artists.length > 0
      ? `${track.name} ${track.artists[0].name} official music -instrumental`
      : `${track.name} -instrumental`;

    // Get search data
    let videos = await ytSearch.search(query, { limit: track.type === 'track' ? 5 : 3, type: 'video' });

    console.log(query);

    // Find closest to the track's duration
    let closestVideo = null;
    let closestDuration = Infinity;

    for (const video of videos) {
      // Check if duration is exact
      if (video.duration === track.duration_ms) {
        return video.id;
      }

      // Check if closest duration
      const durationDiff = Math.abs(video.duration - track.duration_ms);
      // check if the durationDiff of current video is lower than the previous closestDuration
      if (durationDiff < closestDuration) {
        closestDuration = durationDiff;
        closestVideo = video;
      }
    }

    // the lowest durationDiff will be the video that get returned
    return closestVideo ? closestVideo.id : null;
  } catch (error) {
    console.error(error);
  }
};

const downloadYT = async (id: string): Promise<Buffer | undefined> => {
  try {
    // Get info
    const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`);
    // Choose the highest quality audio format
    const audioFormat = ytdl.chooseFormat(info.formats, {
      quality: 'highestaudio',
    });

    // Get audio stream and process it
    const audioStream = ytdl.downloadFromInfo(info, { format: audioFormat });
    const buffer = streamToBuffer(audioStream);

    return buffer;
  } catch (error) {
    console.error(error);
  }
};

async function streamToBuffer(stream: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];

    stream
      .pipe(new PassThrough())
      .on('data', (chunk: any) => chunks.push(chunk))
      .on('error', (err: any) => reject(err))
      .on('end', () => resolve(Buffer.concat(chunks)));
  });
}

// UTIL FUNCTIONS
const pathNamify = (path: string) => {
  // @ts-ignore
  return filenamify(path).replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '');
};
