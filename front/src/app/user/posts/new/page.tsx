"use client"

import { useState } from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import snakecaseKeys from 'snakecase-keys';
import { FaGithub, FaGoogle, FaCreditCard, FaPaypal, FaApple, FaStar, FaRegCalendarAlt } from 'react-icons/fa';
import { MdOutlinePublic, MdOutlineLock } from 'react-icons/md';
import { AiOutlineTeam } from 'react-icons/ai';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { BsPencilSquare } from 'react-icons/bs';
import useTags from  '../../../hooks/useTags'

interface FormData {
  title: string;
  start_date: string;
  end_date: string;
  recruiting_count: number;
  status: 'open' | 'closed';
  tags: [];
  description: string;
  category_id: number;
}

const postSchema = z.object({
  title: z.string().min(5, { message: "タイトルは少なくとも5文字以上〜100文字以内で入力してください。" }),
  tags: z.string()
    .nonempty({ message: "タグは少なくとも一つ入力してください。" })
    .max(200, { message: "タグは最大200文字までです。" })
    .regex(/^[\w\-\s,]+$/, { message: "タグは英数字、ハイフン、スペース、カンマのみ使用できます。" }),
  start_date: z.string().nonempty({ message: "開始日は必須です。" }),
  end_date: z.string().nonempty({ message: "終了日は必須です。" }),
  recruiting_count: z.number().min(2).max(20, { message: "募集人数は2から20の間である必要があります。" }),
  description: z.string()
    .min(30, { message: "少なくとも30文字以上の入力が必要です。" })
    .max(2000, { message: "最大2000文字までです。" }),
  status: z.enum(['open', 'closed']).refine(val => ['open', 'closed'].includes(val), { 
    message: "ステータスは'open'または'closed'である必要があります。" 
  }),
  category_id: z.number().nonnegative({ message: "カテゴリーIDは正の数である必要があります。" })
});

export default function PostForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(postSchema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const createPost = async (formData :FormData) => {
    const formDataRecord = { ...formData };
    setIsLoading(true);
    
    // フォームのバリデーションなどのロジックをここに追加
    //if (!title || !startDate || !endDate || !description) return;
    const session = await getSession();
    const token = session?.accessToken;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
    const url = `${apiUrl}/api/v1/user_posts`;
    const postData = {
      post: {
        ...snakecaseKeys(formDataRecord),
        tags: formDataRecord.tags,
      }
    };

    try {
      const response = await axios.post(url, postData, {
        headers: headers,
        withCredentials: true
      });
      toast.success(response.data.message);
      setTimeout(() => {
        router.push(`/posts/${response.data.data.id}/room`);
        setIsLoading(false);
      }, 5000);

    } catch (error: unknown) {
      // エラーオブジェクトがAxiosError型のインスタンスであるかをチェック
      setIsLoading(false); // ローディング終了
      if (axios.isAxiosError(error)) {
        console.log(error)
        // エラーレスポンスが存在し、その中にメッセージがある場合は表示する
        if (error.response && error.response.data && typeof error.response.data.message === 'string') {
          toast.error(error.response.data.message);
        } else {
          // その他のエラーの場合は汎用的なメッセージを表示
          toast.error("投稿に問題が発生しました");
        }
      }
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-blue-50 to-blue-100">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          <h2 className="mt-5 text-2xl text-white blink">
            チャットルームを作成中です...
          </h2>
        </div>
      )}
      <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">新しい投稿を作成</h2>
        <form onSubmit={handleSubmit(createPost)} className="grid grid-cols-1 gap-6">
        <ToastContainer />
  
          {/* タイトル */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <BsPencilSquare className="mr-2" />
              <label className="block text-gray-700 text-sm font-bold">タイトル</label>
            </div>            
            <input
              type="text"
              {...register("title")}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="プロジェクト名を入力してください"
            />
            {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
          </div>
  
          {/* 技術スタック */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <BsPencilSquare className="mr-2" />
              <label className="block text-gray-700 text-sm font-bold">使用予定技術</label>
            </div>            
            <input
              type="text"
              {...register("tags")}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Rails, Ruby, Docker, カンマ区切りで入力"
            />
            {errors.tags && <p className="text-red-600 text-sm">{errors.tags.message}</p>}
          </div>
  
          {/* 開始日フィールド */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <FaRegCalendarAlt className="mr-2" />
              <label className="block text-gray-700 text-sm font-bold">開始日</label>
            </div>            
            <input
              type="datetime-local"
              {...register("start_date")}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.start_date && <p className="text-red-600 text-sm">{errors.start_date.message}</p>}
          </div>
  
          {/* 終了日フィールド */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <FaRegCalendarAlt className="mr-2" />
              <label className="block text-gray-700 text-sm font-bold">終了日</label>              
            </div>
            <input
              type="datetime-local"
              {...register("end_date")}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.end_date && <p className="text-red-600 text-sm">{errors.end_date.message}</p>}
          </div>
  
          {/* 募集人数フィールド */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <IoMdAddCircleOutline className="mr-2" />
              <label className="block text-gray-700 text-sm font-bold">募集人数</label>
            </div>
            <select
              {...register("recruiting_count", { valueAsNumber: true })}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              {[...Array(19)].map((_, i) => (
                <option key={i + 2} value={i + 2}>{i + 2} 人</option>
              ))}
            </select>
            {errors.recruiting_count && <p className="text-red-600 text-sm">{errors.recruiting_count.message}</p>}
          </div>
  
          {/* 公開ステータス */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <MdOutlinePublic className="mr-2" />
              <label className="block text-gray-700 text-sm font-bold">公開ステータス</label>
            </div>
            <select
              {...register("status")}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="open">公開中</option>
              <option value="closed">締め切り</option>
            </select>
            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
          </div>
  
          {/* カテゴリー */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <FaStar className="mr-2" />
              <label className="block text-gray-700 text-sm font-bold">募集カテゴリ</label>
            </div>  
            <select
              {...register("category_id", { valueAsNumber: true })}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value={1}>チーム開発</option>
              <option value={2}>ペアプロ</option>
              <option value={3}>GitHub-Flow</option>
              {/* その他のオプション */}
            </select>
            {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>}
          </div>
  
          {/* 説明フィールド */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <MdOutlineLock className="mr-2" />
              <label className="block text-gray-700 text-sm font-bold">募集概要</label>
            </div>
            <textarea
              {...register("description")}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={10}
              placeholder="プロジェクトの詳細を入力してください"
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>
  
          {/* 送信ボタン */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              投稿
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}