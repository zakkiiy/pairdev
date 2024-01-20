import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import fetcherWithAuth from '../utils/fetcher';

const useRoomStatus = (postId: any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${apiUrl}/api/v1/posts/${postId}/room_status`
  // const { data: session, status } = useSession();
  const { data: room, error } = useSWR(url, fetcherWithAuth); // fetcherWithAuthを使用
  // const posts = rawPosts ? rawPosts.map((post :Post) => camelcaseKeys(post, {deep:true})) : null;

  return {
    roomStatus: room?.status,
    isLoading: !error && !room,
    isError: error
  }
}

export default useRoomStatus