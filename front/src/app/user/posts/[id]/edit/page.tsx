'use client'
import fetcherWithAuth from '../../../../utils/fetcher';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import camelcaseKeys from "camelcase-keys";
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { getSession } from 'next-auth/react';
import snakecaseKeys from 'snakecase-keys';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod";


const postSchema = z.object({
  title: z.string().min(2, { message: "タイトルは少なくとも5文字以上必要です。" }),
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
      post: snakecaseKeys(formDataRecord)
    };

    try {
      const response = await axios.put(url, editPostData, {
        headers: headers,
        withCredentials: true
      });
      
      router.push(`/posts/${id}`);
      setTimeout(() => {
        // 少し遅延させる 
        toast.success(response.data.message);
      }, 500);


    } catch (error: unknown) {
      // エラーオブジェクトがAxiosError型のインスタンスであるかをチェック
      if (axios.isAxiosError(error)) {
        console.log(error)
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

  if (error) return <p className="text-center text-red-500">エラーが発生しました。</p>;

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">編集</h2>
      <form onSubmit={handleSubmit(editPost)}>
        {/* タイトルフィールド */}
        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-700">タイトル</label>
          <input
            type="text"
            className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            {...register("title")} defaultValue={post.title}
          />
          {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
        </div>
        {/* 開始日フィールド */}
        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-700">開始日</label>
          <input
            type="datetime-local"
            className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            {...register("start_date")} defaultValue={post.startDate}
          />
          {errors.start_date && <p className="text-red-600 text-sm">{errors.start_date.message}</p>}
        </div>
        
        {/* 終了日フィールド */}
        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-700">終了日</label>
          <input
            type="datetime-local"
            className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            {...register("end_date")} defaultValue={post.endDate}
          />
          {errors.end_date && <p className="text-red-600 text-sm">{errors.end_date.message}</p>}
        </div>
        
        {/* 募集人数フィールド */}
        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-700">募集人数</label>
          <select
            className="form-select mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            {...register("recruiting_count", { valueAsNumber: true })} defaultValue={post.recruitingCount}
          >
            {[...Array(19)].map((_, i) => (
              <option key={i + 2} value={i + 2}>
                {i + 2}
              </option>
            ))}
          </select>
          {errors.recruiting_count && <p className="text-red-600 text-sm">{errors.recruiting_count.message}</p>}
        </div>

        {/* 公開ステータス */}
        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-700">公開ステータス</label>
          <select className="form-select mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            {...register("status")} defaultValue={post.status}
          >
            <option value="open">公開中</option>
            <option value="closed">締め切り</option>
          </select>
          {errors.status && <p className="text-red-600 text-sm">{errors.status.message}</p>}
        </div>

        {/* カテゴリー */}
        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-700">募集カテゴリ</label>
          <select className="form-select mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            {...register("category_id", { valueAsNumber: true })} defaultValue={post.categoryName}
          >
            <option value={1}>チーム開発</option>
            <option value={2}>ペアプロ</option>
            <option value={3}>GitHub-Flow</option>
          </select>
          {errors.category_id && <p className="text-red-600 text-sm">{errors.category_id.message}</p>}
        </div>

        
        {/* 説明フィールド */}
        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-700">募集概要</label>
          <textarea
            className="form-textarea mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            {...register("description")} defaultValue={post.description}
          ></textarea>
          {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
        </div>

        {/* 送信ボタン */}
        <div className="flex justify-center">
          <button 
            type="submit" 
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            保存
          </button>
        </div>
        <ToastContainer />
      </form>
    </div>
  )
}