"use client";

import { FiDownload } from "react-icons/fi";
import Spinner from "../Spinner";
import { useDownloader } from "../context/Download";
import Check from "../Check";

const DownloadTrack = ({ track }: { track: any }) => {
  const { addDownload, itemState } = useDownloader();

  const handleDownload = () => {
    addDownload(track, "slow");
  };

  const trackState: any = () => itemState(track);

  // Check if downloaded
  if (trackState === "downloaded") {
    return (
      <div className="bg-accent/50 rounded p-1.5 md:p-2.5 text-lg">
        <Check />
      </div>
    );
  }
  // Check if queued
  else if (trackState === "queued")
    return (
      <div className="bg-accent/10 rounded p-1.5 md:p-2.5 text-lg">
        <Spinner />
      </div>
    );
  // Check if downloading
  else if (trackState === "downloading") {
    return (
      <div className="bg-accent/80 rounded p-1.5 md:p-2.5 text-lg">
        <Spinner />
      </div>
    );
  }

  // Return download button
  else
    return (
      <button
        onClick={() => handleDownload()}
        aria-label="Download Track"
        className="text-white bg-accent hover:bg-accent/90 transition-colors rounded p-1.5 md:p-2.5 text-lg"
      >
        <FiDownload />
      </button>
    );
};

export default DownloadTrack;
