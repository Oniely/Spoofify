export const downloadBlob = (blob: Blob, name: string) => {
  // Create a blob URL and initiate download
  if (!blob) return

  const url = window.URL.createObjectURL(new Blob([blob]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', name)
  document.body.appendChild(link)
  link.click()
}

export const detectSpotifyLink = (url: string) => {
  if (typeof url !== 'string') return { type: null, id: null }

  const spotifyRegex =
    /^https?:\/\/open\.spotify\.com\/(track|album|playlist|episode|artist|user\/[a-zA-Z0-9]+)\/([a-zA-Z0-9]+)(\?.*)?$/

  const match = url.match(spotifyRegex)

  if (match) {
    const type = match[1]
    const id = match[2]
    return { type, id }
  } else {
    return { type: null, id: null }
  }
}

export const getFilenameFromHeaders = (headers: any) => {
  const contentDisposition = headers['content-disposition']
  const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/

  const matches = filenameRegex.exec(contentDisposition)
  let filename = 'download.mp3'

  if (matches != null && matches[1]) {
    filename = matches[1].replace(/['"]/g, '')
  }
  return filename
}

export const serverTimestamp = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  const second = String(now.getSeconds()).padStart(2, '0')
  const millisecond = String(now.getMilliseconds()).padStart(3, '0')

  return `${year}-${month}-${day} ${hour}:${minute}:${second}.${millisecond}`
}
