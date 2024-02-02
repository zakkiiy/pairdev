import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NextAuthProvider from '@/providers/NextAuth';
import Header from './components/Header';
import Footer from './components/Footer';
import { Poppins } from "next/font/google";
const HachiMaruPopFont = Poppins({ weight: "500", subsets: ["latin"] });
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://pairdev.vercel.app/'), //本番環境のアプリ名
  title: 'pairdev',
  description: 'プログラミング学習のペアを募集できるアプリ',
  openGraph: {
		title: 'pairdev',
    description: 'プログラミング学習のペアを募集できるアプリ',
	},
	twitter: {
		title: 'pairdev',
    description: 'プログラミング学習のペアを募集できるアプリ',
		card: 'summary_large_image',
	},
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${HachiMaruPopFont.className} flex flex-col min-h-screen`}>
        <NextAuthProvider>
          <Header />
            <main className="flex-1">
              {children}
            </main>
            <GoogleAnalytics gaId="G-XYZ" />
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  )
}
