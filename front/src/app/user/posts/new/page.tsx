// メモ
//new

"use client"

import React from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
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
  title: z.string().min(5, { message: "タイトルは少なくとも5文字以上〜100文字以内で入力してください。" }),
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
  // const [title, setTitle] = useState('');
  // const [startDate, setStartDate] = useState('');
  // const [endDate, setEndDate] = useState('');
  // const [recruitingCount, setRecruitingCount] = useState(2);
  // const [description, setDescription] = useState('');
  // const [status, setStatus] = useState('');
  // const [category_id, setCategoryName] = useState(1);

  const createPost = async (formData :FormData) => {
    const formDataRecord = { ...formData };
    // フォームのバリデーションなどのロジックをここに追加
    //if (!title || !startDate || !endDate || !description) return;
    const session = await getSession();
    const token = session?.accessToken;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
    const url = `${apiUrl}/api/v1/user_posts`;
    const postData = {
      post: snakecaseKeys(formDataRecord)
    };

    try {
      const response = await axios.post(url, postData, {
        headers: headers,
        withCredentials: true
      });
      toast.success(response.data.message);

    } catch (error: unknown) {
      // エラーオブジェクトがAxiosError型のインスタンスであるかをチェック
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
      <div className="max-w-3xl mx-auto bg-white p-8 shadow-2xl rounded-xl">
        <h2 className="text-4xl font-bold mb-10 text-center text-gray-800 flex justify-center items-center">
          <AiOutlineTeam className="mr-2" />
          新しい投稿を作成
        </h2>
        <form onSubmit={handleSubmit(createPost)} className="grid grid-cols-1 gap-6">
        <ToastContainer />
    
          {/* タイトルフィールド */}
          <div className="mb-5">
            <label className="block text-xl font-medium text-gray-700 mb-2 flex items-center">
              <BsPencilSquare className="mr-2" />
              タイトル
            </label>
            <input
              type="text"
              className="form-input w-full px-4 py-3 border-2 border-gray-400 rounded-lg shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
              placeholder="プロジェクト名を入力してください"
              {...register("title")}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          {/* 開始日フィールド */}
          <div className="mb-5">
            <label className="block text-xl font-medium text-gray-700 mb-2 flex items-center">
              <FaRegCalendarAlt className="mr-2" />
              開始日
            </label>
            <input
              type="datetime-local"
              className="form-input w-full px-4 py-3 border-2 border-gray-400 rounded-lg shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
              {...register("start_date")}
            />
            {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date.message}</p>}
          </div>

          {/* 終了日フィールド */}
          <div className="mb-5">
            <label className="block text-xl font-medium text-gray-700 mb-2 flex items-center">
              <FaRegCalendarAlt className="mr-2" />
              終了日
            </label>
            <input
              type="datetime-local"
              className="form-input w-full px-4 py-3 border-2 border-gray-400 rounded-lg shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
              {...register("end_date")}
            />
            {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date.message}</p>}
          </div>

          {/* 募集人数フィールド */}
          <div className="mb-5">
            <label className="block text-xl font-medium text-gray-700 mb-2 flex items-center">
              <IoMdAddCircleOutline className="mr-2" />
              募集人数
            </label>
            <select
              className="form-select w-full px-4 py-3 border-2 border-gray-400 rounded-lg shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
              {...register("recruiting_count", { valueAsNumber: true })}
            >
              {[...Array(19)].map((_, i) => (
                <option key={i + 2} value={i + 2}>{i + 2} 人</option>
              ))}
            </select>
            {errors.recruiting_count && <p className="text-red-500 text-sm mt-1">{errors.recruiting_count.message}</p>}
          </div>

          {/* 公開ステータス */}
          <div className="mb-5">
            <label className="block text-xl font-medium text-gray-700 mb-2 flex items-center">
              <MdOutlinePublic className="mr-2" />
              公開ステータス
            </label>
            <select
              className="form-select w-full px-4 py-3 border-2 border-gray-400 rounded-lg shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
              {...register("status")}
            >
              <option value="open">公開中</option>
              <option value="closed">締め切り</option>
            </select>
            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
          </div>

          {/* カテゴリー */}
          <div className="mb-8">
            <label className="block text-xl font-medium text-gray-700 mb-2 flex items-center">
              <FaStar className="mr-2" />
              募集カテゴリ
            </label>
            <select
              className="form-select w-full px-4 py-3 border-2 border-gray-400 rounded-lg shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
              {...register("category_id", { valueAsNumber: true })}
            >
              <option value={1}>チーム開発</option>
              <option value={2}>ペアプロ</option>
              <option value={3}>GitHub-Flow</option>
              {/* その他のオプション */}
            </select>
            {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>}
          </div>

          {/* 説明フィールド */}
          <div className="mb-10">
            <label className="block text-xl font-medium text-gray-700 mb-2 flex items-center">
              <MdOutlineLock className="mr-2" />
              募集概要
            </label>
            <textarea
              className="form-textarea w-full px-4 py-3 border-2 border-gray-400 rounded-lg shadow-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
              rows={5}
              placeholder="プロジェクトの詳細を入力してください"
              {...register("description")}
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          {/* 送信ボタン */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              投稿
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}