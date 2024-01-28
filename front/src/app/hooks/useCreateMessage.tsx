import axios from 'axios';
import { getSession } from 'next-auth/react';
import { useState } from 'react'

const useCreateMessage = (roomId: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${apiUrl}/api/v1/rooms/${roomId}/messages`
  const [errorMessage, setErrorMessage] = useState("");

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
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message || "メッセージ送信に失敗しました");
      }
    }
  }
  return { createMessage, errorMessage };
}
export default useCreateMessage