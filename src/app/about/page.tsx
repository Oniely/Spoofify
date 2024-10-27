import Link from 'next/link'

const About = () => {
  return (
    <div className="w-full flex justify-center">
      <main className="md:mt-[100px] w-full md:w-[700px] py-8 px-5 space-y-4">
        <div className="text-text md:w-4/5 space-y-2">
          <h1 className="text-4xl font-bold mb-4">About</h1>
          <h2 className="text-2xl font-semibold mb-3">What does this website do?</h2>
          <p>
            This website allows users to download Spotify playlists, albums, and tracks easily. When
            downloading playlist the website returns a ZIP file with all the tracks. Individual
            tracks are served with metadata.
          </p>
          <h2 className="text-2xl font-semibold mb-3">How do I use it?</h2>
          <p>
            Simply press on the three dots in a Spotify playlist, album, or track, share it, copy
            the link, then paste the link in the input dialog on the{' '}
            <Link href="/" className="underline">
              home page
            </Link>
            .
          </p>
          <h2 className="text-2xl font-semibold mb-3">How does it work?</h2>
          <p>
            The website uses the Spotify API to get data from playlists, albums and tracks. When
            downloading them it uses <i>youtube-sr</i> to find the best match to the track, then it
            uses <i>ytdl-core</i> to download the match, and serves it to the user in the
            appropriate format.
          </p>
          <p>
            Tracks with metadata are converted to MP3 using <i>ffmpeg.wasm</i> and decorated with
            the data from the Spotify API (title, album, cover, artists).
          </p>
        </div>
      </main>
    </div>
  )
}

export default About
