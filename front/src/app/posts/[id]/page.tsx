'use client'

import useSWR from 'swr';
import fetcherWithAuth from '../../utils/fetcher';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';

import camelcaseKeys from "camelcase-keys";
import Image from 'next/image'
import Link from 'next/link'
import JoinRoomButton from '../../components/JoinRoomButton'
import ConfirmationModal from '../../components/ConfirmationModal'
import { useState } from 'react';
import useJoinRoom from '../../hooks/useJoinRoom';

import DeletePostButton from '@/app/components/DeletePostButton';
import useRoomStatus from '@/app/hooks/useRoomStatus';
import useCheckJoined from '@/app/hooks/useCheckJoined';
import { RiCheckboxBlankCircleFill } from 'react-icons/ri';
import { FaCode, FaLaptopCode, FaTerminal } from 'react-icons/fa';
import { FaCalendarAlt, FaUsers, FaLayerGroup } from 'react-icons/fa';
import { BsFillPersonFill, BsCardChecklist } from 'react-icons/bs';
import LoginToView from '../../components/LoginToView';


interface PostData {
  post: {
    [key: string]: unknown;
    id: number,
    tags: [],
    title: string,
    startDate: string,
    endDate: string,
    recruitingCount: number,
    participantCount: number,
    description: string,
    status: string,
    categoryName: string
  };
  is_poster: boolean;
}

export default function DetailPost() {
  const { data: session, status } = useSession();
  console.log(status)
  const params = useParams()
  const id = params.id
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${apiUrl}/api/v1/posts/${id}`
  const [isModalOpen, setIsModalOpen] = useState(false)
  const joinRoom = useJoinRoom(id);
  const router = useRouter();

  
  // roomのstatuaを取得するフック呼び出し
  const { roomStatus, isLoading, isError } = useRoomStatus(id);
  // ユーザーがroomに参加しているかどうかのステータスを返すフック
  const { isJoined } = useCheckJoined(id);
  console.log("aaa")
  console.log(isJoined)

  const modalMessage = roomStatus == 'full' ? '満員のため閲覧のみ可能です。' : '参加するとチャットルームに移動します。' 

  const { data: rawPost, error } = useSWR<PostData>(url, fetcherWithAuth);
  console.log(rawPost)
  const post = rawPost ? camelcaseKeys(rawPost.post, {deep:true}) : null;
  const isPoster = rawPost ? rawPost.is_poster : false;
  console.log(isPoster)
  

  // 参加ボタンをクリックするとモーダルが開く
  const handleJoinClick = () => {
    setIsModalOpen(true);
    
  };

  // モーダルに対してOKを押すと UserRoom中間テーブル作成しつつroomに飛ばす。
  const handleConfirmJoin = () => {
    setIsModalOpen(false);
    if (roomStatus == 'full') {
      setIsModalOpen(false);
    } else {
      joinRoom();
    }
  };

  // 閲覧の場合は部屋にroomに飛ばす。
  const viewOnlyRoom = () => {
    router.push(`/posts/${id}/room`);
  }

  // ログインしてない場合の処理
  
  if (status === "unauthenticated") {
    return <LoginToView status={status} />;
  }


  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Image src="/loading.svg" width={500} height={500} alt="loading..." className="animate-spin" />
      </div>
    );
  }

  

  if (error) return <p className="text-center text-red-500">エラーが発生しました。</p>;

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex justify-between items-center px-4 py-5 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900">タイトル: {post.title}</h2>
          {/* 編集・削除ボタン（投稿者のみ表示） */}
          {isPoster && (
            <div className="flex space-x-4">
              <button
                onClick={() => viewOnlyRoom() }
                className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-600 bg-white hover:bg-gray-100"
              >
                入室
              </button>
              <Link href={`/user/posts/${id}/edit`}>
                <div className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-600 bg-white hover:bg-gray-100">
                  編集
                </div>
              </Link>
              <DeletePostButton id={post.id} apiUrl={apiUrl} onDeleted={() => console.log("削除されました")} />
            </div>
          )}
          {/* 参加ボタンコンポーネント */}
          {!isPoster && (
            <div className="flex">
              {isJoined ? (
                <button onClick={() => viewOnlyRoom()}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                  参加済み
                </button>
              ) : (
                <JoinRoomButton 
                  onClick={handleJoinClick}
                  status={roomStatus}
                />
              )}
              <button
                onClick={() => viewOnlyRoom()}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                閲覧
              </button>
            </div>
          )}
        </div>
        <div className="px-4 py-5 sm:px-6">
          <FaLayerGroup className="inline mr-2" />
          カテゴリ: {post.categoryName}
        </div>
  
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">使用予定技術</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{post.tags.join(', ')}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">人数</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2"> {post.participantCount} / {post.recruitingCount}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">ステータス</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{post.status}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">開始予定日</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{post.startDate}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">終了予定日</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{post.endDate}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">募集概要</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{post.description}</dd>
            </div>
          </dl>
        </div>
        {/* モーダル表示コンポーネント */}
        <ConfirmationModal 
          isOpen={isModalOpen}
          message={modalMessage}
          onConfirm={handleConfirmJoin}
          onCancel={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}