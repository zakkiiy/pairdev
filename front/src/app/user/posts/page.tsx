"use client";
import React, { useState } from "react";
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import fetcherWithAuth from '../../utils/fetcher'
import camelcaseKeys from "camelcase-keys";
import Image from 'next/image'
import { useRouter } from 'next/router'
import Link from 'next/link';
import { FaCalendarAlt, FaUsers, FaLayerGroup } from 'react-icons/fa';
import { BsFillPersonFill, BsCardChecklist } from 'react-icons/bs';
import { RiCheckboxBlankCircleFill } from 'react-icons/ri';
import { FaCode, FaLaptopCode, FaTerminal } from 'react-icons/fa';
import LoginToView from '../../components/LoginToView';
import UserRoomsList from '../../components/UserRoomsList';

interface Post {
  [key: string]: unknown;
  name: string,
  avatarUrl: string,
  id: bigint,
  title: string,
  tags: [],
  startDate: string,
  endDate: string,
  recruitingCount: number,
  participantCount: number,
  description: string,
  status: 'open' | 'closed',
  categoryName: string
}

const statusColors = {
  open: 'text-green-400',
  closed: 'text-red-400',
  pending: 'text-yellow-400'
};

export default function UserPosts() {
  const [activeTab, setActiveTab] = useState('posts');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${apiUrl}/api/v1/user_posts`
  const { data: session, status } = useSession();
  const { data: rawPosts, error } = useSWR<Post[]>(url, fetcherWithAuth); 
  const posts = rawPosts ? rawPosts.map((post :Post) => camelcaseKeys(post, {deep:true})) : null;
  
  const handleTabChange = (tab :any) => {
    setActiveTab(tab);
  }

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Image src="/loading.svg" width={500} height={500} alt="loading..." className="animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <LoginToView status={status} />;
  }
  
  if (error) return <p className="text-center text-red-500">エラーが発生しました。</p>;

  return (
    <div>
      {status === "authenticated" ? (
        
        <div className="container mx-auto px-4 py-6 bg-gray-50 min-h-screen">
          <nav className="flex space-x-4 mb-4">
            <button
              onClick={() => handleTabChange('rooms')}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${activeTab === 'rooms' ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              ルーム一覧
            </button>
            <button
              onClick={() => handleTabChange('posts')}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${activeTab === 'posts' ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              投稿一覧
            </button>
          </nav>
        

          <div>
            {/* 参加及び自分が投稿した一覧 */}
            {activeTab === 'rooms' && (
              <UserRoomsList />
            )}

            {/* 自分の投稿一覧 */}
            {activeTab === 'posts' && (
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">自分が投稿した一覧</h1>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts?.map((post) => (
                    <Link key={post.id} href={`/posts/${post.id}`} passHref>
                      <div
                        className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 ease-in-out overflow-hidden h-[360px]"
                      >
                        <div className="flex items-center mb-2">
                          <Image
                            src={post.avatarUrl ?? ''}
                            height={20}
                            width={20}
                            style={{ borderRadius: '50px' }}
                            alt="User Avatar"
                          />
                          <p className="ml-2">{post.name}</p>
                        </div>
                        <h2 className="text-lg font-semibold mb-2 truncate">
                          <BsCardChecklist className="inline mr-2" />
                          {post.title}
                        </h2>
                        <p className="text-gray-600 mb-2 truncate">
                          <FaLayerGroup className="inline mr-2" />
                          カテゴリ: {post.categoryName}
                        </p>
                        <p className="text-gray-600 mb-2 truncate">
                          <FaCode className="inline mr-2" />
                          技術: {post.tags.join(', ')}
                        </p>
                        <p className="text-gray-600 mb-2 truncate">
                          <FaUsers className="inline mr-2" />
                          人数: {post.participantCount} / {post.recruitingCount}
                        </p>
                        <p className={`mb-2 truncate ${statusColors[post.status]}`}>
                          <RiCheckboxBlankCircleFill className="inline mr-2" />
                          ステータス: {post.status}
                        </p>
                        <p className="text-gray-600 mb-2 truncate">
                          <FaCalendarAlt className="inline mr-2" />
                          開始日: {post.startDate}
                        </p>
                        <p className="text-gray-600 mb-2 truncate">
                          <FaCalendarAlt className="inline mr-2" />
                          終了日: {post.endDate}
                        </p>
                        <p className="text-gray-600 mt-3 text-sm line-clamp-3">
                          <BsFillPersonFill className="inline mr-2" />
                          概要: {post.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
      
      ) : (
        <h1 className="text-center text-xl text-gray-800">ログインしてください</h1>
      )}
    </div>
  );
}