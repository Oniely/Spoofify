import React from 'react';
import TrackInfo from './TrackInfo';
import { PlayerProvider } from './context/Player';
import SortMenu from './SortMenu';

interface Props {
  tracks: any;
  isAlbum?: boolean;
}

const TrackList = ({ tracks, isAlbum = false }: Props) => {
  return (
    <PlayerProvider>
      <div className="bg-white/5 border border-white/10 w-full backdrop-blur-md p-5 rounded-xl flex flex-col gap-5 text-text">
        <div className="flex justify-between items-center mb-1">
          <p className="text-lg text-white/50">{tracks.items.length || tracks.total} tracks</p>

          <SortMenu />
        </div>
        <ol className="flex flex-col gap-3 w-full">
          {!isAlbum &&
            tracks.items.map((item: any, i: number) => (
              <li key={i}>
                <TrackInfo track={item.track} />
              </li>
            ))}

          {isAlbum &&
            tracks.items.map((item: any, i: number) => (
              <li key={i}>
                <TrackInfo track={item} />
              </li>
            ))}
        </ol>
      </div>
    </PlayerProvider>
  );
};

export default TrackList;
