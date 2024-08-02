'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

const PlayerContext = createContext<any>(null);
export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [trackId, setTrackId] = useState<any>(null);
  const [audio, setAudio] = useState<any>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (audio) {
      if (playing) {
        audio.play();
      } else {
        audio.pause();
      }
    }
  }, [audio, playing, trackId]);

  const loadAudio = (audioUrl: string) => {
    // Pause current audio if any
    audio?.pause();

    // Load audio data
    const audioSrc = new Audio(audioUrl);
    audioSrc.onended = () => {
      setPlaying(false);
    };

    // Set current track
    setTrackId(audioUrl);
    setAudio(audioSrc);

    // Play track regardless of current state
    setPlaying(true);
  };

  const togglePlay = (audioUrl: string) => {
    if (!audio || trackId !== audioUrl) {
      loadAudio(audioUrl);
    } else {
      setPlaying(!playing);
    }
  };

  const isTrackPlaying = (otherTrackId: string) => {
    return trackId === otherTrackId && playing;
  };

  const value = { togglePlay, trackId, playing, isTrackPlaying };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

export default PlayerProvider;
