import HomeButton from '@/components/buttons/HomeButton';
import PlaylistInfo from '@/components/PlaylistInfo';
import TrackList from '@/components/TrackList';
import Search from '@/components/Search';

import { getPlaylist } from '@/lib/spotify';
import { notFound } from 'next/navigation';
import { Playlist as PlaylistType } from '@/components/context/Download';
import { OrderOption, SortOption } from '@/components/SortMenu';

const Playlist = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { sort?: SortOption; order?: OrderOption };
}) => {
  const { id } = params;
  let { sort, order } = searchParams;

  sort = sort || 'Date added';
  order = order || 'asc';

  const playlist: PlaylistType = await getPlaylist(id, sort, order);

  if (!playlist) notFound();

  // console.log(playlist.tracks.items)

  return (
    <div className="w-full flex justify-center">
      <main className="md:mt-[100px] w-full md:w-[700px] py-8 px-5 space-y-4">
        <div className="flex items-center w-full gap-4">
          <HomeButton />
          <Search />
        </div>
        {playlist ? (
          <>
            <PlaylistInfo playlist={playlist} />
            <TrackList tracks={playlist.tracks} />
          </>
        ) : null}
      </main>
    </div>
  );
};

export default Playlist;
