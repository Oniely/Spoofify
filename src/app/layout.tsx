import Providers from '@/components/context/Providers'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const font = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spoofify',
  description: 'Spoofify a spotify to mp3 downloader',
  icons: [
    {
      url: '/logo.png',
      href: '/logo.png',
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={font.className}>
        <div className="w-full h-full fixed -z-10">
          <div className="absolute bottom-0 md:bottom-1/4 left-0 md:left-1/3 w-44 h-44 bg-accent rounded-full blur-[180px]" />
          <div className="absolute bottom-2/3 left-[100px] w-24 h-24 bg-accent rounded-full blur-[150px] hidden md:block" />
          <div className="absolute top-10 right-24 w-32 h-32 bg-accent rounded-full blur-[150px]" />
        </div>

        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
