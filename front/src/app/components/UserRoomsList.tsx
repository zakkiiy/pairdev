
import useSWR from 'swr';
import fetcherWithAuth from '../utils/fetcher'
import camelcaseKeys from "camelcase-keys";
import Link from 'next/link';

interface Room {
  roomUserId: number;
  roomId: number;
  postId: number;
  postTitle: string;
}

const UserRoomsList = () => {
  // const apiUrl = process.env.NEXT_PUBLIC_API_URL
  // const url = `${apiUrl}/api/v1/user_rooms`
  // const { data: rawRooms, error } = useSWR<Room[]>(url, fetcherWithAuth);

  //const rooms = rawRooms ? rawRooms.map(room => camelcaseKeys(room, { deep: true }) as any) : null;
  
  return (
    <div>
      <div>参加済みチャット一覧　準備中</div>
      {/* {rooms?.map(room => (
        <div key={room.roomId}>
        <Link href={`/posts/${room.postId}`}>{room.postTitle}</Link>
        <Link href={`/posts/${room.postId}/room`}>チャットルームに入る</Link>
      </div> 
      ))} */}
    </div>
  ) as any;
}

export default UserRoomsList