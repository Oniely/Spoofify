import Link from "next/link";
import { BsGithub } from "react-icons/bs";

const Github = () => {
  return (
    <Link
      className="text-white/50 flex items-center gap-3 text-xs border border-white/50 backdrop-blur-md px-2 py-1.5 rounded-full shadow-lg hover:border-white hover:text-white transition-colors"
      href="https://github.com/jtayped/spotify-downloader"
    >
      <BsGithub size={17} />
      GitHub Repo
    </Link>
  );
};

export default Github;
