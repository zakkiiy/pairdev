"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from "zod";
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import fetcherWithAuth from '../utils/fetcher';
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from 'snakecase-keys';
import { useEffect } from "react"
import { getSession } from 'next-auth/react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Profile {
  [key: string]: unknown;
  localName: string,
  gender: number,
  age: number,
  experience: number,
  description: string
}

interface FormData {
  localName: string;
  gender: number;
  age: number | null; // age は null を許容する
  experience: number;
  description: string;
}

// バリデーション
const profileSchema = z.object({
  localName: z.string().max(10, { message: "ニックネームは最大10文字までです。" }),
  gender: z.union([z.literal(0), z.literal(1), z.literal(2)]),
  age: z.union([z.number().min(0).max(100), z.null()]),
  experience: z.number().min(0).max(30),
  description: z.string().max( 1000, {message: "最大1000文字まで入力できます。"} )
})

const Profile = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${apiUrl}/api/v1/profile/edit_form`
  const { data: rawProfile, error } = useSWR<Profile>(url, fetcherWithAuth);
  const profile = rawProfile ? camelcaseKeys(rawProfile, {deep:true}) : null;
  console.log(profile)

  // 初期値をフォームにセット
  const { register, handleSubmit, setValue, formState: {errors} } = useForm<FormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      Object.keys(profile).forEach(key => {
        const value = profile[key];
        if (value !== null && (typeof value === 'string' || typeof value === 'number')) {
          setValue(key as keyof FormData, value);
        }
      });
    }
  }, [profile, setValue]);

  const editProfile = async (formData :FormData) => {
    const formDataRecord = {...formData};
    const session = await getSession();
    const token = session?.accessToken;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
    const url = `${apiUrl}/api/v1/profile`;
    const editProfleData = {
      post: {
        ...snakecaseKeys(formDataRecord),
      }
    };

    try {
      const response = await axios.put(url, editProfleData, {
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
          toast.error("編集に問題が発生しました");
        }
      }
    }
  }

  return (
    <>
      {profile && (
        <form onSubmit={handleSubmit(editProfile)} className="max-w-lg mx-auto p-4 bg-white rounded shadow">
          <h2 className="text-xl font-bold mb-4">プロフィール編集</h2>

          {/* 名前 */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">名前</label>
            <input
              type="text"
              {...register("localName")}
              defaultValue={profile.localName}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.localName && <p className="text-red-600 text-sm">{errors.localName.message}</p>}
          </div>

          {/* 性別 */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">性別</label>
            <select
              {...register("gender")}
              defaultValue={profile.gender}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value={0}>未定義</option>
              <option value={1}>男性</option>
              <option value={2}>女性</option>
            </select>
          </div>

          {/* 年齢 */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">年齢</label>
            <input
              type="number"
              {...register("age")}
              defaultValue={profile.age}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* 経験年数 */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">経験年数</label>
            <input
              type="number"
              {...register("experience")}
              defaultValue={profile.experience}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* 説明 */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">自己紹介</label>
            <textarea
              {...register("description")}
              defaultValue={profile.description}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
          </div>

          {/* 送信ボタン */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              更新
            </button>
          </div>
        </form>
      )}
    </>
  );
}

export default Profile
