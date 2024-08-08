import HomeButton from '@/components/buttons/HomeButton';
import PlayerProvider from '@/components/context/Player';
import Search from '@/components/Search';
import TrackInfo from '@/components/TrackInfo';
import { getTrack } from '@/lib/spotify';
import { notFound } from 'next/navigation';

const Track = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const track = await getTrack(id);

  if (!track) notFound();

  return (
    <div className="w-full flex justify-center">
      <main className="md:mt-[100px] w-full md:w-[700px] py-8 px-5 space-y-4">
        <div className="flex items-center w-full gap-4">
          <HomeButton />
          <Search />
        </div>

        {track ? (
          <div className="bg-white/5 border border-white/10 w-full backdrop-blur-md p-5 rounded-xl flex flex-col gap-5 text-text">
            <PlayerProvider>
              <TrackInfo track={track} type='Track' />{' '}
            </PlayerProvider>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default Track;
