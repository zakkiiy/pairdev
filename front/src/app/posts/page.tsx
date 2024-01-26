"use client";
import React, { useState } from "react";
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import useSWR from 'swr';
import fetcherWithAuth from '../utils/fetcher'
import Link from 'next/link'
import camelcaseKeys from "camelcase-keys";
import { FaCalendarAlt, FaUsers, FaLayerGroup } from 'react-icons/fa';
import { BsFillPersonFill, BsCardChecklist } from 'react-icons/bs';
import { RiCheckboxBlankCircleFill } from 'react-icons/ri';
import { FaCode, FaLaptopCode, FaTerminal } from 'react-icons/fa';


interface Post {
  [key: string]: unknown; 
  id: bigint,
  tags: [],
  title: string,
  startDate: string,
  endDate: string,
  recruitingCount: number,
  description: string,
  status: 'open' | 'closed',
  categoryName: string
}

export default function Posts() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${apiUrl}/api/v1/posts`
  const { data: session, status } = useSession();
  const { data: rawPosts, error } = useSWR<Post[]>(url, fetcherWithAuth); // fetcherWithAuthを使用
  const posts = rawPosts ? rawPosts.map((post :Post) => camelcaseKeys(post, {deep:true})) : null;

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Image src="/loading.svg" width={500} height={500} alt="loading..." className="animate-spin" />
      </div>
    );
  }
  
  if (error) return <p className="text-center text-red-500">エラーが発生しました。</p>;

  const statusColors = {
    open: 'text-green-400',
    closed: 'text-red-400',
    pending: 'text-yellow-400'
  };
  
  return (
    <div className="container mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      {status === "authenticated" ? (
        <div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            募集一覧
          </span>
          <div className="grid grid-cols-3 gap-8">
            {posts?.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`} passHref>
                <div
                  key={post.id}
                  className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out h-72 overflow-hidden"
                >
                  <h2 className="text-xl font-semibold mb-2 truncate">
                    <BsCardChecklist className="inline mr-2" />
                    タイトル: {post.title}
                  </h2>
                  <div className="text-gray-700 mb-2 truncate">
                    <FaLayerGroup className="inline mr-2" />
                    カテゴリ: {post.categoryName}
                  </div>
                  <div className="text-gray-700 mb-2 truncate">
                    <FaCode className="inline mr-2" />
                    使用予定技術: {post.tags.join(', ')}
                  </div>
                  <div className="text-gray-700 mb-2 truncate">
                    <FaUsers className="inline mr-2" />
                    人数: {post.recruitingCount}
                  </div>
                  <div className="mb-2 truncate">
                    <RiCheckboxBlankCircleFill className={`inline mr-2 ${statusColors[post.status]}`} />
                    ステータス: {post.status}
                  </div>
                  <div className="text-gray-700 mb-2 truncate">
                    <FaCalendarAlt className="inline mr-2" />
                    開始予定日: {post.startDate}
                  </div>
                  <div className="text-gray-700 mb-2 truncate">
                    <FaCalendarAlt className="inline mr-2" />
                    終了予定日: {post.endDate}
                  </div>
                  <p className="text-gray-600 mt-3 text-sm line-clamp-3">
                    <BsFillPersonFill className="inline mr-2" />
                    募集概要: {post.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <h1 className="text-center text-xl text-gray-800">ログインしてください</h1>
      )}
    </div>
  );
}