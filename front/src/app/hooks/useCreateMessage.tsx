import axios from 'axios';
import { getSession } from 'next-auth/react';

const useCreateMessage = (roomId: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${apiUrl}/api/v1/rooms/${roomId}/messages`

  const createMessage = async (messageText: string) => {
    try {
      const session = await getSession();
      const token = session?.accessToken;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.post(url, { message: { content: messageText } }, {
        headers: headers,
        withCredentials: true
      });
    } catch (error: unknown) {
      // エラーオブジェクトがAxiosError型のインスタンスであるかをチェック
      if (axios.isAxiosError(error)) {
        console.log(error)
        // エラーレスポンスが存在し、その中にメッセージがある場合は表示する
        if (error.response && error.response.data && typeof error.response.data.message === 'string') {
          //toast.error(error.response.data.message);
        } else {
          // その他のエラーの場合は汎用的なメッセージを表示
          //toast.error("参加に問題が発生しました");
        }
      }
    }
  }
  return createMessage
}
export default useCreateMessage