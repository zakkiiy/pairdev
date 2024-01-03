'use client'
import Login from './Login'
import Logout from './Logout'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const Header = () => {
  const { data: session, status } = useSession();
  return(
    <header className="bg-gray-500 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">PairDev</h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/posts/index">
                <div className="text-white hover:text-indigo-400">募集一覧</div>
              </Link>
            </li>
            <li>
              <Link href="/user_posts/create">
                <div className="text-white hover:text-indigo-400">新規募集</div>
              </Link>
            </li>
            <li>
              <Link href="/user_posts/index">
                <div className="text-white hover:text-indigo-400">マイエリア</div>
              </Link>
            </li>
            <li>
              <Link href="/articles">
                <div className="text-white hover:text-indigo-400">記事</div>
              </Link>
            </li>
          </ul>
        </nav>
        {status === 'authenticated' ? (
          <div className="flex items-center space-x-4">
            <span>ようこそ、{session.user?.name}さん</span>
            <Logout />
          </div>
        ) : (
          <Login />
        )}
      </div>
    </header>
  )
}

export default Header