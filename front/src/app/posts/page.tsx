"use client";
import React, { useState } from "react";
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import useSWR from 'swr';
import fetcherWithAuth from '../utils/fetcher'
import Link from 'next/link'
import camelcaseKeys from "camelcase-keys";

interface Post {
  [key: string]: unknown; 
  id: bigint,
  title: string,
  startDate: Date,
  endDate: Date,
  recruitingCount: bigint,
  description: string,
  status: string,
  categoryName: string
}

export default function Posts() {
  const { data: session, status } = useSession();
  const { data: rawPosts, error } = useSWR<Post[]>('/api/v1/posts', fetcherWithAuth); // fetcherWithAuthを使用
  const posts = rawPosts ? rawPosts.map((post :Post) => camelcaseKeys(post, {deep:true})) : null;

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Image src="/loading.svg" width={500} height={500} alt="loading..." className="animate-spin" />
      </div>
    );
  }
  
  if (error) return <p className="text-center text-red-500">エラーが発生しました。</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      {status === "authenticated" ? (
        <div>
          <h1 className="text-3xl font-bold text-center py-4 my-6 text-gray-900">募集一覧</h1>
          <div className="grid grid-cols-3 gap-16">
            {posts?.map((post :any) => (
              <div
                key={post.id}
                className="bg-gray-100 p-4 rounded-lg shadow-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                <h2 className="text-xl font-semibold mb-2">タイトル:{post.title}</h2>
                <div>カテゴリ:{post.categoryName}</div>
                <div>人数:{post.recruitingCount}</div>
                <div>ステータス:{post.status}</div>
                <div>開始予定日:{post.startDate}</div>
                <div>終了予定日:{post.endDate}</div>
                <div>募集概要:{post.description}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <h1 className="text-center text-xl text-gray-800">ログインしてください</h1>
      )}
    </div>
  );
}
