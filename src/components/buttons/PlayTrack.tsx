"use client";
import { usePlayer } from "../context/Player";
import { FaPlay, FaPause } from "react-icons/fa";

const PlayTrack = ({ audioUrl }: { audioUrl: string }) => {
  const { togglePlay, isTrackPlaying } = usePlayer();
  const handleClick = () => {
    togglePlay(audioUrl);
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={!audioUrl}
        aria-label={isTrackPlaying(audioUrl) ? "Pause" : "Play"}
        className="relative p-1.5 md:p-2.5 rounded bg-white/10 border border-white/5 hover:bg-white/15 disabled:hover:bg-white/10 disabled:brightness-50 transition-colors"
      >
        {isTrackPlaying(audioUrl) ? <FaPause /> : <FaPlay />}
      </button>
    </div>
  );
};

export default PlayTrack;
