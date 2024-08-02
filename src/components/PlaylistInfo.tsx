import Image from "next/image";
import Link from "next/link";
import DownloadPlaylist from "./buttons/DownloadPlaylist";

const PlaylistInfo = ({ playlist }: { playlist: any }) => {
  return (
    <header className="bg-white/5 border border-white/10 w-full backdrop-blur-md p-5 rounded-xl flex flex-col sm:flex-row gap-5 md:max-h-[305px]">
      <Link
        href={playlist.external_urls.spotify}
        aria-label="Spotify Playlist"
        className="self-center md:self-start"
      >
        <div className="flex-shrink-0 w-52 h-52 relative rounded-lg overflow-hidden">
          <Image
            src={playlist.images[0].url}
            width={208}
            height={208}
            priority={true}
            alt="Playlist Cover"
            className="w-full h-full"
          />
        </div>
      </Link>
      <div className="flex flex-col justify-between gap-3 md:gap-0">
        <div className="text-white">
          <h1 className="font-bold text-2xl line-clamp-1">{playlist.name}</h1>
          <p
            className="line-clamp-5 prose text-white prose-a:text-gray-200"
            dangerouslySetInnerHTML={{ __html: playlist.description }}
          ></p>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-white/80">
          <DownloadPlaylist playlist={playlist} />
          <div className="flex flex-col text-xs">
            <p>by {playlist.owner.display_name}</p>
            <p>{playlist.followers.total} likes</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PlaylistInfo;
