import Search from "@/components/Search";
import Link from "next/link";

const Home = () => {
   return (
    <div className="w-full h-full flex items-center justify-center">
    <div className="px-5 w-full md:w-[700px] space-y-5">
      <div className="text-text">
        <h1 className="text-4xl font-bold">Spoofify - a spotify downloader</h1>
        <p className="mt-2">
          Easily download spotify <b>playlists or tracks</b> by simply pasting
          the URL in the input dialog. This page uses YouTube to find the best
          match download. Please refer to the{" "}
          <Link className="underline" href="/about">
            about
          </Link>{" "}
          page for more info and instructions.
        </p>
      </div>
      <Search />
    </div>
  </div>
   )
}

export default Home;