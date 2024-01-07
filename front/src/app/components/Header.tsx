'use client'
import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaRobot, FaListAlt, FaPlusCircle, FaUserCircle, FaNewspaper } from 'react-icons/fa';
import Login from './Login';
import Logout from './Logout';

const Header = () => {
  const { data: session, status } = useSession();

  return (
    <header className="bg-gradient-to-r from-gray-700 to-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FaRobot className="text-4xl text-blue-400" />
          <h1 className="text-xl font-bold text-white">PairDev</h1>
        </div>
        <nav>
          <ul className="flex space-x-6 items-center">
            <li>
              <Link href="/posts">
                <div className="flex items-center text-white hover:text-blue-400">
                  <FaListAlt className="mr-2" />募集一覧
                </div>
              </Link>
            </li>
            <li>
              <Link href="/user_posts/create">
                <div className="flex items-center text-white hover:text-blue-400">
                  <FaPlusCircle className="mr-2" />新規募集
                </div>
              </Link>
            </li>
            <li>
              <Link href="/user/posts">
                <div className="flex items-center text-white hover:text-blue-400">
                  <FaUserCircle className="mr-2" />マイエリア
                </div>
              </Link>
            </li>
            <li>
              <Link href="/articles">
                <div className="flex items-center text-white hover:text-blue-400">
                  <FaNewspaper className="mr-2" />記事
                </div>
              </Link>
            </li>
          </ul>
        </nav>
        {status === 'authenticated' ? (
          <div className="flex items-center space-x-4">
            <span>{session.user?.name}</span>
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
