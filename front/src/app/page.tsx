"use client";
import React, { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import Login from './components/Login';
import Logout from './components/Logout';

type Post = {
  id: number;
  title: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newTitle, setNewTitle] = useState("");

  const { data: session, status } = useSession();

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`);
      if (!response.ok) {
        throw new Error("データの取得に失敗しました");
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle }),
      });
      if (!response.ok) {
        throw new Error("投稿に失敗しました");
      }
      setNewTitle("");
      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <div>
			{status === 'authenticated' ? (
				<div>
					<p>ようこそ、{session.user?.name}さん</p>
					<img
						src={session.user?.image ?? ``}
						alt=""
						style={{ borderRadius: '50px' }}
					/>
					<div>
						<Logout />
					</div>
				</div>
			) : (
				<Login />
			)}
		</div>
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h2 className="text-3xl mb-4">記事の一覧</h2>
      <form onSubmit={handleSubmit} className="mt-4 mb-4">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="新しい投稿のタイトル"
          className="mr-2 p-2 border"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white">
          投稿する
        </button>
      </form>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </main>
    </>
  );
}
