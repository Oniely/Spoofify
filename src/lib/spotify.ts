'use server';

import { OrderOption, SortOption } from '@/components/SortMenu';
import axios from 'axios';

export const getToken = async () => {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    'grant_type=client_credentials',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      auth: {
        username: process.env.CLIENT_ID!,
        password: process.env.CLIENT_SECRET!,
      },
    }
  );

  return response.data.access_token;
};

export const getRequest = async (url: string) => {
  const token = await getToken();
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export async function getPlaylist(
  id: string,
  sort: SortOption,
  order: OrderOption
) {
  try {
    let playlist = await getRequest(
      `https://api.spotify.com/v1/playlists/${id}`
    );

    let { next } = playlist.tracks;
    while (next) {
      const nextTracks = await getRequest(next);
      playlist.tracks.items.push(...nextTracks.items);

      next = nextTracks.next;
    }

    if (sort) {
      // check order and determine the multiplier
      // with the multiplier, if asc: 1 (remain the same) and desc: -1 (reverse the order)
      // -1 * (a - b) vs 1 * (a - b)
      const sortOrder = order === 'asc' ? 1 : -1;

      if (sort === 'Date added') {
        playlist.tracks.items.sort(
          (
            a: { added_at: string | number | Date },
            b: { added_at: string | number | Date }
          ) =>
            sortOrder *
            (new Date(a.added_at).getTime() - new Date(b.added_at).getTime())
        );
      } else if (sort === 'Custom order') {
        const sortedItems =
          order === 'desc'
            ? playlist.tracks.items.slice().reverse()
            : playlist.tracks.items.slice();

        playlist.tracks.items = sortedItems
      }
    }

    playlist.tracks.items = playlist.tracks.items
      .filter((item: any) => item.track)
      .map((item: any, idx: number) => ({
        ...item,
        track: {
          ...item.track,
          order: idx + 1,
        },
      }));

    return playlist;
  } catch (error) {
    console.error(`Error fetching playlist: ${error}`);
  }
}

export async function getTrack(id: string) {
  try {
    const track = await getRequest(`https://api.spotify.com/v1/tracks/${id}`);
    return track;
  } catch (error) {
    console.error('Error fetching track: ', error);
  }
}

export async function getAlbum(id: string) {
  try {
    let album = await getRequest(`https://api.spotify.com/v1/albums/${id}`);

    const albumImage = album.images.length > 0 ? album.images[0].url : null;

    let { next } = album.tracks;
    while (next) {
      const nextTracks = await getRequest(next);
      album.tracks.items.push(...nextTracks.items);

      next = nextTracks.next;
    }

    // add metadata
    album.tracks.items = album.tracks.items.map((track: any) => ({
      ...track,
      images: [
        {
          url: albumImage,
        },
      ],
      album: {
        name: album.name,
        images: [
          {
            url: albumImage,
          },
        ],
      },
    }));

    return album;
  } catch (error) {
    console.error('Error fetching album: ', error);
  }
}
