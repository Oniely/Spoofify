'use client'

import DownloadDialog from '@/components/DownloadDialog'
import Queue from '@/components/Queue'
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'

import axios from 'axios'
import JSZip from 'jszip'

import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

import { ID3Writer } from 'browser-id3-writer'
import { v4 as uuidv4 } from 'uuid'

import { Playlist, Track } from '@/lib/types'
import { downloadBlob, getFilenameFromHeaders } from '@/lib/utils'

const DownloaderContext = createContext<any>(null)
export const useDownloader = () => useContext(DownloaderContext)

// Global FFmpeg instance to be reused
let ffmpegInstance: FFmpeg | null = null
const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'

const getFFmpeg = async (): Promise<FFmpeg> => {
  if (!ffmpegInstance || !ffmpegInstance.loaded) {
    console.log('Loading FFmpeg...')
    ffmpegInstance = new FFmpeg()
    await ffmpegInstance.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })
  }
  console.log('FFmpeg Loaded')
  return ffmpegInstance
}

export const DownloaderProvider = ({ children }: { children: ReactNode }) => {
  const [queue, setQueue] = useState<any[]>([])
  const [currentDownload, setCurrentDownload] = useState<any | null>(null)
  const [downloadedItems, setDownloadedItems] = useState<any[]>([])
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dialogItem, setDialogItem] = useState<any | null>(null)
  const [defaultSpeed, setDefaultSpeed] = useState<'slow' | 'fast' | null>(null)

  useEffect(() => {
    const download = async () => {
      const type = currentDownload.type

      if (type === 'playlist') {
        const { blob, filename } = await downloadPlaylist(currentDownload, 'Playlist')
        await downloadBlob(blob, filename)
      } else if (type === 'track') {
        // @ts-ignore
        const { buffer, filename } = await downloadTrack(currentDownload)
        await downloadBlob(buffer, filename)
      } else if (type === 'album') {
        const { blob, filename } = await downloadAlbum(currentDownload)
        await downloadBlob(blob, filename)
      }

      addToDownloaded(currentDownload)
      setProgress(0)
      setDownloading(false)
    }

    if (currentDownload) {
      download()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDownload])

  useEffect(() => {
    const nextInQueue = () => {
      if (queue.length !== 0) {
        const next = queue[0]
        setQueue((prev) => [...prev.slice(1, prev.length)])
        return next
      }
      return null
    }

    if (queue.length !== 0 && !downloading) {
      const next = nextInQueue()
      setCurrentDownload(next || null)
      setDownloading(true)
    } else if (!downloading) {
      setCurrentDownload(null)
    }
  }, [queue, downloading])

  const downloadPlaylist = async (playlist: Playlist, type: 'Playlist' | 'Album') => {
    try {
      const items = playlist.tracks.items
      const zip = new JSZip()

      console.log('PLAYLIST DOWNLOAD LOADING FFMPEG...')
      let ffmpeg = await getFFmpeg()

      const chunkSize = 15
      const totalChunks = Math.ceil(items.length / chunkSize)

      for (let i = 0; i < totalChunks; i++) {
        if (!ffmpeg.loaded && playlist.speed === 'slow') {
          ffmpeg = await getFFmpeg()
        }

        const chunkStart = i * chunkSize
        const chunkEnd = Math.min(chunkStart + chunkSize, items.length)
        const chunkItems = items.slice(chunkStart, chunkEnd)

        const tracks = chunkItems.map((item) => (type === 'Playlist' ? item.track.name : item.name))
        console.log('Chunk Size: ', chunkItems.length)
        console.log('Chunk Items: ', tracks)

        const downloadPromises = chunkItems.map((item) => {
          const track: Track | any = type === 'Playlist' ? { ...item.track } : { ...item }
          return downloadTrack({ ...track, speed: playlist.speed }, ffmpeg).then((track) => {
            setProgress((prev) => prev + (1 / playlist.tracks.total) * 100)
            return track
          })
        })

        const downloads = await Promise.all(downloadPromises)
        downloads.forEach((download) => {
          if (download) {
            const { filename, buffer } = download
            zip.file(filename, buffer)
          }
        })
      }

      const blob = await zip.generateAsync({ type: 'blob' })
      const filename = pathNamify(playlist.name) + '.zip'

      return { blob, filename }
    } catch (error) {
      console.error('Error in downloadPlaylist:', error)
      throw error
    }
  }

  const downloadAlbum = async (playlist: Playlist) => {
    return downloadPlaylist(playlist, 'Album')
  }

  const downloadTrack = async (track: Track & { speed: 'slow' | 'fast' }, ffmpeg: FFmpeg) => {
    try {
      const response = await axios.post('/api/download/track', track, {
        responseType: 'blob',
      })

      let buffer = response.data
      let filename = getFilenameFromHeaders(response.headers)

      if (track.speed === 'slow') {
        buffer = await convert(buffer, ffmpeg)
        if (!buffer) return null

        buffer = await addMetadata(buffer, track)
        filename = filename.slice(0, -4) + '.mp3'
      }

      return { buffer, filename }
    } catch (error) {
      console.error('Error in downloadTrack:', error)
      return null
    }
  }

  function pathNamify(path: string) {
    return path.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, '')
  }

  async function convert(trackBufferBlob: Blob, ffmpeg: FFmpeg): Promise<ArrayBuffer | null> {
    const id = uuidv4()
    const inputFileName = `/tmp/${id}.m4a`
    const outputFileName = `/tmp/${id}.mp3`

    try {
      if (!ffmpeg) {
        ffmpeg = await getFFmpeg()
      }

      await ffmpeg.writeFile(inputFileName, await fetchFile(trackBufferBlob))
      // prettier-ignore
      await ffmpeg.exec([
        '-i', inputFileName,
        '-b:a', '320k',
        '-ac', '2',
        '-ar', '32000',
        outputFileName,
      ])
      const data = await ffmpeg.readFile(outputFileName)

      // @ts-ignore
      return data.buffer
    } catch (error) {
      console.error('Error in audio conversion:', error)
      return null
    } finally {
      try {
        await Promise.all([ffmpeg.deleteFile(inputFileName), ffmpeg.deleteFile(outputFileName)])
      } catch (error) {
        console.warn('Error during cleanup:', error)
      }
    }
  }

  async function addMetadata(buffer: ArrayBuffer, track: Track) {
    try {
      const cover = await fetchCover(track.album.images[0].url)
      const writer = new ID3Writer(buffer)

      writer
        .setFrame('TIT2', track.name)
        .setFrame('TALB', track.album.name)
        .setFrame('TRCK', `${track.order || track.track_number}`)
        .setFrame(
          'TPE1',
          track.artists.map((artist) => artist.name)
        )
        .setFrame('APIC', {
          type: 3,
          data: cover,
          description: `${track.name} cover`,
        })

      return writer.addTag()
    } catch (error) {
      console.error('Error adding metadata:', error)
      return null
    }
  }

  async function fetchCover(url: string) {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' })
      return response.data
    } catch (error) {
      console.error('Error in fetchCover:', error)
      return null
    }
  }

  const addDownload = (spotifyItem: Track | Playlist, speed: 'slow' | 'fast') => {
    setQueue((prev) => [...prev, { ...spotifyItem, speed }])
  }

  const addToDownloaded = (item: any) => {
    setDownloadedItems((prev) => [...prev, item])
  }

  const itemState = (item: any) => {
    const downloadedItem = downloadedItems.find((downloadedItem) => item.id === downloadedItem.id)
    if (downloadedItem) return 'downloaded'

    if (item.id === currentDownload?.id) return 'downloading'

    const queuedItem = queue.find((queueItem) => item.id === queueItem.id)
    if (queuedItem) return 'queued'

    return null
  }

  const openDialog = (item: any) => {
    setDialogItem(item)
  }

  const closeDialog = () => {
    setDialogItem(null)
  }

  const value = {
    addDownload,
    currentDownload,
    itemState,
    queue,
    progress,
    openDialog,
    closeDialog,
    dialogItem,
    setDefaultSpeed,
    defaultSpeed,
  }

  return (
    <DownloaderContext.Provider value={value}>
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full md:w-[700px] z-10"
        style={{ padding: 12 }}
      >
        <Queue />
      </div>
      <DownloadDialog />
      {children}
    </DownloaderContext.Provider>
  )
}
