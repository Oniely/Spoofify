import HomeButton from '@/components/buttons/HomeButton';
import PlaylistInfo from '@/components/PlaylistInfo';
import Search from '@/components/Search';
import TrackList from '@/components/TrackList';
import { getAlbum } from '@/lib/spotify';
import { notFound } from 'next/navigation';

const Album = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const album = await getAlbum(id);

  if (!album) notFound();

  return (
    <div className="w-full flex justify-center">
      <main className="md:mt-[100px] w-full md:w-[700px] py-8 px-5 space-y-4">
        <div className="flex items-center w-full gap-4">
          <HomeButton />
          <Search />
        </div>

        {album ? (
          <>
            <PlaylistInfo playlist={album} />
            <TrackList tracks={album.tracks} type='Album' />
          </>
        ) : null}
      </main>
    </div>
  );
};

export default Album;
