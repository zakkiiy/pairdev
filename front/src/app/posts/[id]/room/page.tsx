'use client'

import useSWR from 'swr';
import fetcherWithAuth from '../../../utils/fetcher';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import camelcaseKeys from "camelcase-keys";
import Image from 'next/image'
import RoomMessages from '../../../components/RoomMessages'

const Room = () => {
  const { data: session, status } = useSession();
  const params = useParams()
  const id = params.id
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${apiUrl}/api/v1/posts/${id}/room`

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
      <RoomMessages roomId={room.id} />
    </div>
  );

}

export default Room;

