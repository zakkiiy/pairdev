'use client'

import useSWR from 'swr';
import fetcherWithAuth from '../../../utils/fetcher';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import camelcaseKeys from "camelcase-keys";
import Image from 'next/image'

const Room = () => {
  const { data: session, status } = useSession();
  const params = useParams()
  const id = params.id
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${apiUrl}/api/v1/posts/${id}/room`

  const { data: rawRoom, error } = useSWR(url, fetcherWithAuth);
  console.log(rawRoom)
  const room = rawRoom ? camelcaseKeys(rawRoom, {deep:true}) : null;

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
    <>
      <p>{room?.post?.title}</p>
      <p>{room?.post?.recruitingCount}</p>
    </>
  )

}

export default Room;