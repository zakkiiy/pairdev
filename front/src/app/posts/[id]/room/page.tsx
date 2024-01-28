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

const Room = () => {
  const { data: session, status } = useSession();
  const params = useParams()
  const id = params.id
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${apiUrl}/api/v1/posts/${id}/room`
  
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
    toast.success(response.data.message);
    setIsModalOpen(false);
    } catch (error) {
      // エラーが発生した場合の処理
      console.error("退出処理中にエラーが発生しました:", error);
    }
  }

  const { data: rawResponse, error } = useSWR(url, fetcherWithAuth);
  const responce = rawResponse ? camelcaseKeys(rawResponse, {deep:true}) : null;
  
  const post = responce?.post 
  const room = responce?.room

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Image src="/loading.svg" width={500} height={500} alt="loading..." className="animate-spin" />
      </div>
    );
  }

  if (error) return <p className="text-center text-red-500">エラーが発生しました。</p>;

  if (!room) {
    return <div>Loading...</div>;
  }

  const roomTitle = room?.post?.title || 'タイトル未設定';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{post?.title}</h1>
      <p className="text-md">Recruiting: {post?.recruitingCount}</p>
      <button
        onClick={handleModalOpen}
        className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-600 bg-white hover:bg-gray-100"
      >
        退出
      </button>
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

