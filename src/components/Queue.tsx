"use client";
import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useDownloader } from "./context/Download";

const PREVIEW_MAX_IMAGES = 3;
const Queue = () => {
  const [closed, setClosed] = useState(true);
  const { currentDownload, queue } = useDownloader();

  const toggleClose = () => {
    setClosed(!closed);
  };

  if (closed)
    return (
      <div className="w-full flex justify-center mb-7">
        {currentDownload ? (
          <motion.button
            className="relative flex items-center gap-2 bg-white/10 border border-white/10 text-white backdrop-blur-md p-1.5 rounded-full shadow-2xl"
            aria-label="Open queue info"
            onClick={toggleClose}
            initial={{ y: 500, scale: 0 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ duration: 0.4, type: "spring" }}
          >
            <ul className="flex items-center -space-x-2">
              {queue
                .slice(0, PREVIEW_MAX_IMAGES - 1)
                .reverse()
                .map((item: any, i: number) => (
                  <li key={i}>
                    <Image
                      src={
                        (item.type === "playlist" || item.type === "album")
                          ? item.images[0].url
                          : item.album.images[0].url
                      }
                      className="rounded-full"
                      width={20}
                      height={20}
                      priority={true}
                      alt={`${currentDownload.type} cover`}
                    />
                  </li>
                ))}
              <li>
                <Image
                  src={
                    (currentDownload.type === "playlist" || currentDownload.type === "album")
                      ? currentDownload.images[0].url
                      : currentDownload.album?.images[0].url
                  }
                  className="rounded-full"
                  width={20}
                  height={20}
                  alt={`${currentDownload.type} cover`}
                />
              </li>
            </ul>
            {queue.length >= PREVIEW_MAX_IMAGES ? (
              <span className="text-sm">
                +{queue.length - PREVIEW_MAX_IMAGES + 1} more
              </span>
            ) : null}

            <FiChevronUp size={20} />
            <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-white animate-ping blur-[1px]" />
          </motion.button>
        ) : null}
      </div>
    );
  else
    return (
      <>
        {currentDownload && (
          <motion.div
            initial={{ y: 500, scale: 0 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="w-full bg-white/5 rounded-lg border border-white/20 backdrop-blur-md p-2.5 text-white shadow-lg"
          >
            <div className="flex gap-3">
              <Link href={currentDownload.external_urls.spotify}>
                <Image
                  src={
                    (currentDownload.type === "playlist"|| currentDownload.type === "album")
                      ? currentDownload.images[0].url
                      : currentDownload.album?.images[0].url
                    }
                  width={165}
                  height={165}
                  className="rounded"
                  alt={`${currentDownload.type} cover`}
                />
              </Link>
              <div className="flex flex-col justify-between w-full">
                <div>
                  <div className="flex items-start justify-between">
                    <p className="font-semibold text-lg md:text-xl line-clamp-1">
                      {currentDownload.name}
                    </p>
                    <button
                      aria-label="Close queue info"
                      className="text-2xl"
                      onClick={toggleClose}
                    >
                      <FiChevronDown />
                    </button>
                  </div>

                  {currentDownload.type === "playlist" ? (
                    <span className="text-xs">
                      <p>
                        {currentDownload.followers.total} likes · by{" "}
                        {currentDownload.owner.display_name}
                      </p>
                    </span>
                  ) : (
                    <nav className="flex items-center gap-2 text-xs max-w-[190px] whitespace-nowrap overflow-hidden">
                      {currentDownload.artists.map((artist: any) => (
                        <Link
                          key={artist.id}
                          href={artist.external_urls.spotify}
                          className="hover:underline"
                        >
                          {artist.name}
                        </Link>
                      ))}
                    </nav>
                  )}
                </div>
                <div className="text-xs space-y-1">
                  <span>
                    {queue.length !== 0 ? (
                      <p className="text-xs line-clamp-1">
                        Next in queue: {queue[0].name}
                      </p>
                    ) : (
                      "Downloading..."
                    )}
                  </span>
                  <div className="w-full h-1 bg-white/50 rounded-full overflow-hidden">
                    <div className="progress w-full h-full bg-white/90 left-right"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </>
    );
};

export default Queue;
