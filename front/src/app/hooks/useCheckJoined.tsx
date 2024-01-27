import useSWR from 'swr';
import fetcherWithAuth from '../utils/fetcher';

// 部屋参加チェックして、ボタンを動的に変更する
const useCheckJoined = (postId :any) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${apiUrl}/api/v1/posts/${postId}/room_join_status`;
  const { data, error } = useSWR(url, fetcherWithAuth);

  const isJoined = data?.isJoined;

  return {
    isJoined
  };
};

export default useCheckJoined;