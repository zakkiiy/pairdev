"use client"

import React from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormData {
  title: string;
  start_date: string;
  end_date: string;
  recruiting_count: number;
  status: 'open' | 'closed'; // 'open' または 'closed' のみを受け入れる
  description: string;
  category_id: number;
}

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

export default function PostForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(postSchema),
  });
  // const [title, setTitle] = useState('');
  // const [startDate, setStartDate] = useState('');
  // const [endDate, setEndDate] = useState('');
  // const [recruitingCount, setRecruitingCount] = useState(2);
  // const [description, setDescription] = useState('');
  // const [status, setStatus] = useState('');
  // const [category_id, setCategoryName] = useState(1);

  const createPost = async (formData :FormData) => { 
    // フォームのバリデーションなどのロジックをここに追加
    //if (!title || !startDate || !endDate || !description) return;
    const session = await getSession();
    const token = session?.accessToken;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
    const url = `${apiUrl}/api/v1/user_posts`;
    const postData = {
      post: {
        title: formData.title,
        start_date: formData.start_date,
        end_date: formData.end_date,
        recruiting_count: formData.recruiting_count,
        status: formData.status,
        description: formData.description,
        category_id: formData.category_id
      }
    };

    try {
      const response = await axios.post(url, postData, {
        headers: headers,
        withCredentials: true
      });
      toast.success(response.data.message);
      console.log(response.data);  // 成功した場合の処理

    } catch (error: unknown) {
      // エラーオブジェクトがAxiosError型のインスタンスであるかをチェック
      if (axios.isAxiosError(error)) {
        console.log(error)
        // エラーレスポンスが存在し、その中にメッセージがある場合は表示する
        if (error.response && error.response.data && typeof error.response.data.message === 'string') {
          console.log(error.response)
          toast.error(error.response.data.message);
        } else {
          // その他のエラーの場合は汎用的なメッセージを表示
          toast.error("投稿に問題が発生しました");
        }
      }
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">新しい投稿を作成</h2>
      <form onSubmit={handleSubmit(createPost)} className="space-y-8">
      <ToastContainer />
        
        {/* タイトルフィールド */}
        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-700">タイトル</label>
          <input
            type="text"
            className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            {...register("title")}
          />
          {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
        </div>
        
        {/* 開始日フィールド */}
        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-700">開始日</label>
          <input
            type="datetime-local"
            className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            {...register("start_date")}
          />
          {errors.start_date && <p className="text-red-600 text-sm">{errors.start_date.message}</p>}
        </div>
        
        {/* 終了日フィールド */}
        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-700">終了日</label>
          <input
            type="datetime-local"
            className="form-input mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            {...register("end_date")}
          />
          {errors.end_date && <p className="text-red-600 text-sm">{errors.end_date.message}</p>}
        </div>
        
        {/* 募集人数フィールド */}
        <div className="space-y-2">
          <label className="block text-lg font-medium text-gray-700">募集人数</label>
          <select
            className="form-select mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            {...register("recruiting_count", { valueAsNumber: true })}
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
            {...register("status")}
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
            {...register("category_id", { valueAsNumber: true })}
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
            {...register("description")}
          ></textarea>
          {errors.description && <p className="text-red-600 text-sm">{errors.description.message}</p>}
        </div>
        
        {/* 送信ボタン */}
        <div className="flex justify-center">
          <button 
            type="submit" 
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            投稿
          </button>
        </div>
      </form>
    </div>
  );
  
}
