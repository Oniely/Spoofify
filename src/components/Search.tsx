'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { detectSpotifyLink } from '@/lib/utils';
import Spinner from './Spinner';

const Search = () => {
  const router = useRouter();

  const [error, setError] = useState(null);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { type, id } = detectSpotifyLink(url);
      if (!type || !id) {
        throw Error(
          "Couldn't identify the URL! Please try again with a valid one."
        );
      }

      if (type === 'playlist' || type === 'track') {
        router.push(`/${type}/${id}`);
      } else {
        throw Error(`Spotify ${type}s are not supported at this moment :(`);
      }
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSearch}
        className="relative w-full flex items-center justify-between gap-2 text-white bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-xl overflow-hidden z-10"
      >
        {loading ? (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/50">
            <Spinner size={25} />
          </div>
        ) : null}
        <button
          className="transition-colors p-2 rounded text-white/50"
          type="submit"
          aria-label="Search"
        >
          <FaSearch />
        </button>
        <div className="flex items-center gap-3 w-full">
          <input
            type="text"
            placeholder="Enter a spotify link"
            className="outline-none bg-transparent w-full"
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
        </div>
      </form>
      {error && <p className="text-red-600">{error}</p>}
    </>
  );
};

export default Search;
