'use client'
import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaRobot, FaListAlt, FaPlusCircle, FaUserCircle, FaNewspaper } from 'react-icons/fa';
import Login from './Login';
import Logout from './Logout';
import { useRouter, useSearchParams, useParams } from 'next/navigation';

const Header = () => {
  const { data: session, status } = useSession();

  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center space-x-4">
          <FaRobot className="text-3xl text-blue-500" />
          <h1 className="text-2xl font-semibold">PairDev</h1>
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-6 items-center">
            <li>
              <Link href="/posts">
                <div className="flex items-center space-x-2 hover:text-blue-400">
                  <FaListAlt /> <span>募集一覧</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/user/posts/new">
                <div className="flex items-center space-x-2 hover:text-blue-400">
                  <FaPlusCircle /> <span>新規募集</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/user/posts">
                <div className="flex items-center space-x-2 hover:text-blue-400">
                  <FaUserCircle /> <span>マイエリア</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/articles">
                <div className="flex items-center space-x-2 hover:text-blue-400">
                  <FaNewspaper /> <span>記事</span>
                </div>
              </Link>
            </li>
          </ul>
        </nav>
        {status === 'authenticated' ? (
          <div className="flex items-center space-x-4">
            <span className="hidden md:block">{session.user?.name}</span>
            <Logout />
          </div>
        ) : (
          <Login />
        )}
      </div>
    </header>
  );
};

export default Header;