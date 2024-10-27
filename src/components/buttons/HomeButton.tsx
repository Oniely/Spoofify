import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa'

const HomeButton = () => {
  return (
    <Link
      href="/"
      aria-label="Home page"
      className="text-white/50 hover:text-white/90 hover:bg-white/10 transition-colors bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4"
    >
      <FaArrowLeft />
    </Link>
  )
}

export default HomeButton
