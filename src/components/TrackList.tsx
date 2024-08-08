import React from 'react';
import TrackInfo from './TrackInfo';
import { PlayerProvider } from './context/Player';

interface Props {
  tracks: any;
  type: 'Playlist' | 'Album' | 'Track';
}

const TrackList = ({ tracks, type }: Props) => {
  return (
    <PlayerProvider>
      <div className="bg-white/5 border border-white/10 w-full backdrop-blur-md p-5 rounded-xl flex flex-col gap-5 text-text">
        <div className="flex justify-between items-center">
          <p className="text-lg text-white/50">{tracks.total} tracks</p>
        </div>
        <ol className="flex flex-col gap-3 w-full">
          {type === 'Playlist' ||
            (type === 'Track' &&
              tracks.items.map((item: any, i: number) => {
                const track = item.track;
                return (
                  <li key={i}>
                    <TrackInfo track={track} type={type} />
                  </li>
                );
              }))}

          {type === "Album" && 
            tracks.items.map((item: any, i: number) => {
              return (
                <li key={i}>
                  <TrackInfo track={item} type={type} />
                </li>
              )
            })
          }
        </ol>
      </div>
    </PlayerProvider>
  );
};

export default TrackList;
