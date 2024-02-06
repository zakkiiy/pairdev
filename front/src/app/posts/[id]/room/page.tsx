'use client'

import useSWR from 'swr';
import fetcherWithAuth from '../../../utils/fetcher';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import camelcaseKeys from "camelcase-keys";
import Image from 'next/image'
import RoomMessages from '../../../components/RoomMessages'
import { useState } from 'react'
import Modal from '../../../components/Modal'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginToView from '../../../components/LoginToView';
import TwitterShareButton from '../../../components/TwitterShareButton';

type User = {
  name: string;
  avatarUrl: string;
  profile: {
    localName: string | null;
    gender: 'male' | 'female' | 'undefined' | null;
    age: number | null;
    experience: number | null;
    description: string | null;
  };
};


const Room = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const { data: session, status } = useSession();
  const params = useParams()
  const id = params.id
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${apiUrl}/api/v1/posts/${id}/room`
  const shareUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  const [profileToShow, setProfileToShow] = useState<any>(null);
  const handleMouseOver = (profile :any) => {
    setProfileToShow(profile);
  };
  
  
  const handleMouseOut = () => {
    setProfileToShow(null);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);
  const handleDeleteConfirm = async () => {
  
    const session = await getSession();
    const token = session?.accessToken;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
    try {
      const response = await axios.delete(`${apiUrl}/api/v1/posts/${id}/room`, {
        headers: headers,
        withCredentials: true
    });
    setIsLoading(true);
    // toast.success(response.data.message);
    setIsModalOpen(false);
    setTimeout(() => {
      router.push(`/posts`);
      setIsLoading(false);
    }, 2000);
    } catch (error) {
      setIsLoading(false);
      console.error("退出処理中にエラーが発生しました:", error);
    }
  }

  const { data: rawResponse, error } = useSWR(url, fetcherWithAuth);
  const response = rawResponse ? camelcaseKeys(rawResponse, {deep:true}) : null;

  const post = response?.post
  const room = response?.room
  const participantCount = response?.participantCount
  const isParticipant = response?.isParticipant;
  const isCreator = response?.isCreator;
  // よう修正
  const users: User[] = response ? (response.userNames as any[]).map((name, index) => {
    const profileData = (response.profiles as any[])[index];
    return {
      name: name,
      avatarUrl: (response.avatarUrls as any[])[index],
      profile: {
        localName: profileData?.localName || null,
        gender: profileData?.gender || null,
        age: profileData?.age || null,
        experience: profileData?.experience || null,
        description: profileData?.description || null
      }
    };
  }) : [];

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

  if (!room) {
    return <div>Loading...</div>;
  }

  const roomTitle = room?.post?.title || 'タイトル未設定';
  

  return (
    <div className="relative container mx-auto p-4">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          <h2 className="mt-5 text-2xl text-white blink">
            チャットルームから退出中です。
          </h2>
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex flex-col justify-around w-8 h-6 z-50">
          <div className="w-full h-1 bg-black rounded"></div>
          <div className="w-full h-1 bg-black rounded"></div>
          <div className="w-full h-1 bg-black rounded"></div>
        </button>

        <h1 className="text-2xl font-bold z-50">{/* タイトル */}</h1>
      </div>

      {isMenuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-white shadow-lg rounded-lg p-4 z-40 transition-all duration-300">
          <p className="text-md">タイトル: {post?.title}</p>
          <p className="text-md">人数 :  {participantCount} / {post?.recruitingCount}</p>
          <div className="mt-3">
            <p className="font-semibold mb-2">参加者:</p>
            <div className="flex flex-col">
              {users.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center mb-2"
                  onMouseOver={() => handleMouseOver(user.profile)}
                  onMouseOut={handleMouseOut}
                >
                  <Image src={user.avatarUrl} height={30} width={30} className="rounded-full" alt="User Avatar" />
                  <p className="ml-2">{user.name}</p>
                </div>
              ))}
            </div>
            {/* プロフィール情報の表示 */}
            {profileToShow && (
              <div className="bg-gray-100 p-4 mt-2 rounded">
              <p>名前: {profileToShow.localName || '未設定'}</p>
              <p>性別: {profileToShow.gender === 'male' ? '男性' : profileToShow.gender === 'female' ? '女性' : '未設定'}</p>
              <p>年齢: {profileToShow.age ? `${profileToShow.age} 歳` : '未設定'}</p>
              <p>経験年数: {profileToShow.experience ? `${profileToShow.experience} 年` : '未設定'}</p>
              <p>自己紹介: {profileToShow.description || '自己紹介はありません'}</p>
            </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-center my-4">
        <div className="bg-gradient-to-r from-blue-100 via-gray-300 to-blue-100 text-gray-800 p-4 rounded shadow-lg max-w-md text-center">
          {isCreator ? (
            <div>
              <p>管理者：あなたは部屋の管理者です。</p>
              <TwitterShareButton 
                twitterUrl={`${shareUrl}posts/${id}`}
                postTitle={post?.title} />
              </div>
          ) : isParticipant ? (
            <p>ステータス：参加中</p>
          ) : (
            <div>
              <p>ステータス：閲覧中</p>
              <p>閲覧中のためメッセージを送ることはできません</p>
            </div>
          )}
        </div>
      </div>
      
      {/* 投稿者と閲覧者は退出ボタンを非公開 */}
      <div className="flex justify-end">
        {!isCreator && isParticipant && (
         <div className="flex justify-between items-center">
          <p className="text-xs text-gray-600">
            注意：退出ボタンを押すと、部屋から完全に退出し、メッセージを送信できなくなります。
          </p>
          <button
            onClick={handleModalOpen}
            className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-600 bg-white hover:bg-gray-100"
          >
            退出
          </button>
       </div>
        )}
      </div>
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleModalClose}
        onConfirm={handleDeleteConfirm}
        onCancel={handleModalClose}
        message="退出すると再度参加するまでメッセージを書き込めなくなりますが、よろしいですか。"
      />
      <RoomMessages roomId={room.id} />
    </div>
  );
}

export default Room;
