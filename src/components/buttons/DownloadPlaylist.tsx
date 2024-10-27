'use client'

import { Playlist } from '@/lib/types'
import { motion } from 'framer-motion'
import { FiDownload } from 'react-icons/fi'
import Check from '../Check'
import Spinner from '../Spinner'
import { useDownloader } from '../context/Download'

const DownloadPlaylist = ({ playlist }: { playlist: Playlist }) => {
  const { itemState, progress, openDialog, addDownload, defaultSpeed } = useDownloader()

  const handleClick = () => {
    if (defaultSpeed) {
      addDownload(playlist, defaultSpeed)
    } else {
      openDialog(playlist)
    }
  }

  // Check if downloaded
  if (itemState(playlist) === 'downloaded') {
    return (
      <div className="flex items-center justify-center gap-3 bg-accent/50 px-5 py-2 rounded w-[150px]">
        <Check />
        Downloaded
      </div>
    )

    // Check if queued
  } else if (itemState(playlist) === 'queued') {
    return (
      <div className="flex items-center gap-3 bg-accent/10 px-5 py-2 rounded">
        <Spinner />
        Queued
      </div>
    )

    // Check if downloading
  } else if (itemState(playlist) === 'downloading')
    return (
      <div className="bg-accent/50 px-5 py-2 rounded w-[150px] relative text-center overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-accent/80 -z-10"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.25 }}
        />
        {Math.round(progress)}%
      </div>
    )
  // Return download button
  else
    return (
      <>
        <button
          onClick={handleClick}
          aria-label="Download Playlist"
          className="text-white flex items-center justify-center gap-3 bg-accent hover:bg-accent/90 transition-colors rounded px-5 py-2 w-[150px]"
        >
          <FiDownload className="text-md" />
          Download
        </button>
      </>
    )
}

export default DownloadPlaylist
