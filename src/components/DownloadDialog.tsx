'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { FaPersonRunning, FaPersonWalking } from 'react-icons/fa6'
import { MdOutlineClose } from 'react-icons/md'
import { useDownloader } from './context/Download'

const DownloadDialog = () => {
  const { dialogItem, closeDialog, addDownload, setDefaultSpeed, defaultSpeed } = useDownloader()

  const [rememberSpeed, setRememberSpeed] = useState<any>(false)

  const handleDownload = (speed: any) => {
    addDownload(dialogItem, speed)
    closeDialog()

    if (rememberSpeed) {
      setDefaultSpeed(speed)
    }
  }

  return (
    <AnimatePresence>
      {dialogItem && !defaultSpeed ? (
        <div className="fixed w-full h-screen flex items-center justify-center z-50 px-7">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            onClick={closeDialog}
            className="absolute top-0 left-0 w-full h-full bg-black/70"
          />
          <motion.main
            initial={{ y: 60, scale: 0, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 400, scale: 0, opacity: 0 }}
            className="w-full md:w-[400px] bg-white/10 border border-white/10 p-4 backdrop-blur-xl text-text rounded-xl relative"
          >
            <button className="absolute top-3 right-3" onClick={closeDialog}>
              <MdOutlineClose size={23} />
            </button>
            <p className="text-xl font-semibold whitespace-nowrap max-w-[230px] md:max-w-[300px] overflow-hidden truncate">
              {dialogItem.name}
            </p>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <button
                onClick={() => handleDownload('slow')}
                className="bg-white/10 rounded-lg flex flex-col gap-3 items-center justify-center p-4 text-white/70 hover:text-white group transition-colors border border-white/10"
              >
                <FaPersonWalking size={50} />
                <div>
                  <p className="text-sm">Slow download</p>
                  <p className="text-xs text-white/50">Metadata, .mp3</p>
                </div>
              </button>
              <button
                onClick={() => handleDownload('fast')}
                className="bg-white/10 rounded-lg flex flex-col gap-3 items-center justify-center p-4 text-xs text-white/70 hover:text-white transition-colors border border-white/10"
              >
                <FaPersonRunning size={50} />
                <div>
                  <p className="text-sm">Fast download</p>
                  <p className="text-xs text-white/50">No metadata, .m4a</p>
                </div>
              </button>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                onChange={(e) => setRememberSpeed(e.target.value)}
                value={rememberSpeed}
                className="relative peer appearance-none h-4 w-4 rounded bg-white/50 checked:bg-white/80"
              />
              <div className="absolute w-4 h-4 hidden peer-checked:flex items-center justify-center pointer-events-none">
                <div className="w-2 h-2 bg-black/80 rounded-sm" />
              </div>
              <label id="rememberChoice">Remember my choice</label>
            </div>
          </motion.main>
        </div>
      ) : null}
    </AnimatePresence>
  )
}

export default DownloadDialog
