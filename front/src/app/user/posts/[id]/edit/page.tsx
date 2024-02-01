'use client'
import fetcherWithAuth from '../../../../utils/fetcher';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import camelcaseKeys from "camelcase-keys";
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import snakecaseKeys from 'snakecase-keys';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod";
import { FaGithub, FaGoogle, FaCreditCard, FaPaypal, FaApple, FaStar, FaRegCalendarAlt } from 'react-icons/fa';
import { MdOutlinePublic, MdOutlineLock } from 'react-icons/md';
import { AiOutlineTeam } from 'react-icons/ai';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { BsPencilSquare } from 'react-icons/bs';
import LoginToView from '../../../../components/LoginToView';

const postSchema = z.object({
  title: z.string().min(5, { message: "タイトルは少なくとも5文字以上必要です。" }),
  tags: z.string()
    .min(1, { message: "タグは少なくとも一つ入力してください。" })
    .max(200, { message: "タグは最大200文字までです。" })
    .regex(/^[\w\-\s,]+$/, { message: "タグは英数字、ハイフン、スペース、カンマのみ使用できます。" }),
  start_date: z.string().nonempty({ message: "開始日は必須です。" }),
  end_date: z.string().nonempty({ message: "終了日は必須です。" }),
  recruiting_count: z.number().min(2).max(20, { message: "募集人数は2から20の間である必要があります。" }),
  description: z.string().min(10, { message: "少なくとも10文字以上の入力が必要です。" }),
  status: z.enum(['open', 'closed']).refine(val => ['open', 'closed'].includes(val), { 
    message: "ステータスは'open'または'closed'である必要があります。" 
  }),
  category_id: z.number().nonnegative({ message: "カテゴリーIDは正の数である必要があります。" })
});

interface Post {
  [key: string]: unknown; 
  id: number,
  tags: [],
  title: string,
  startDate: string,
  endDate: string,
  recruitingCount: number,
  description: string,
  status: string,
  categoryName: string
}

interface FormData {
  title: string;
  start_date: string;
  end_date: string;
  recruiting_count: number;
  status: 'open' | 'closed'; // 'open' または 'closed' のみを受け入れる
  tags: [];
  description: string;
  category_id: number;
}

export default function EditPost() {
  const { data: session, status } = useSession();
  const params = useParams()
  const id = params.id
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${apiUrl}/api/v1/user_posts/${id}/edit_form`
  const { data: rawPost, error } = useSWR<Post>(url, fetcherWithAuth);
  const post = rawPost ? camelcaseKeys(rawPost, {deep:true}) : null;
  const router = useRouter();
  

  // データを取得して、初期値をフォームにセット
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(postSchema),
  });


  useEffect(() => {
  if (post) {
    (Object.keys(post) as Array<keyof Post>).forEach(key => {
      const value = post[key];
        if (typeof value === 'string' || typeof value === 'number') {
          setValue(key as keyof FormData, value);
        }
      });
    }
  }, [post, setValue]);

  const editPost = async (formData :FormData) => {
    
    const formDataRecord = {...formData};
    const session = await getSession();
    const token = session?.accessToken;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
    const url = `${apiUrl}/api/v1/user_posts/${id}`;
    const editPostData = {
      post: {
        ...snakecaseKeys(formDataRecord),
        tags: formDataRecord.tags,
      }
    };

    try {
      const response = await axios.put(url, editPostData, {
        headers: headers,
        withCredentials: true
      });
      
      router.push(`/posts/${id}`);
      setTimeout(() => {
        toast.success(response.data.message);
      }, 500);

    } catch (error: unknown) {
      // エラーオブジェクトがAxiosError型のインスタンスであるかをチェック
      if (axios.isAxiosError(error)) {
        
        // エラーレスポンスが存在し、その中にメッセージがある場合は表示する
        if (error.response && error.response.data && typeof error.response.data.message === 'string') {
          toast.error(error.response.data.message);
        } else {
          // その他のエラーの場合は汎用的なメッセージを表示
          toast.error("編集に問題が発生しました");
        }
      }
    }
  }

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Image src="/loading.svg" width={500} height={500} alt="loading..." className="animate-spin" />
      </div>
    );
  }

  // ログインしてない場合の処理
  if (status === "unauthenticated") {
    return <LoginToView status={status} />;
  }

  if (error) return <p className="text-center text-red-500">エラーが発生しました。</p>;

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8 bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">編集</h2>
        <form onSubmit={handleSubmit(editPost)} className="grid grid-cols-1 gap-6">
          
          {/* タイトル */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <BsPencilSquare className="mr-2" />
              <label className="block text-gray-700 text-sm font-bold">タイトル</label>
            </div>            
            <input
              type="text"
              {...register("title")} defaultValue={post.title}
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
              {...register("tags")} defaultValue={post.tags.join(', ')}
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
              type="date"
              {...register("start_date")} defaultValue={post.startDate}
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
              type="date"
              {...register("end_date")} defaultValue={post.endDate}
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
              {...register("recruiting_count", { valueAsNumber: true })} defaultValue={post.recruitingCount}
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
              {...register("status")} defaultValue={post.status}
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
              {...register("category_id", { valueAsNumber: true })} defaultValue={post.categoryName}
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
              {...register("description")} defaultValue={post.description}
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
              保存
            </button>
          </div>
          <ToastContainer />
        </form>
      </div>
    </div>
  )
}