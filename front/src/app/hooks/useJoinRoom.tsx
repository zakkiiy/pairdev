import axios from 'axios';
import { getSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useState } from 'react'

const useJoinRoom = (postId: any) => {
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${apiUrl}/api/v1/posts/${postId}/room/room_user`
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const joinRoom = async () => {

    try {
      const session = await getSession();
      const token = session?.accessToken;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.post(url,{}, {
        headers: headers,
        withCredentials: true
      });
      setIsLoading(true);
      //toast.success(response.data.message);
      setTimeout(() => {
        router.push(`/posts/${postId}/room`);
        setIsLoading(false);
      }, 2000);      
    } catch (error: unknown) {
      // エラーオブジェクトがAxiosError型のインスタンスであるかをチェック
      if (axios.isAxiosError(error)) {
        // エラーレスポンスが存在し、その中にメッセージがある場合は表示する
        if (error.response && error.response.data && typeof error.response.data.message === 'string') {
          toast.error(error.response.data.message);
        } else {
          // その他のエラーの場合は汎用的なメッセージを表示
          toast.error("参加に問題が発生しました");
        }
      }
    }
  }
  return { joinRoom, isLoading };
}

export default useJoinRoom
