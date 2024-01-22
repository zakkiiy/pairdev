type RoomStatus = 'full' | 'open' | 'closed テスト';

interface JoinRoomButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  status: RoomStatus;
}

const JoinRoomButton: React.FC<JoinRoomButtonProps> = ({  onClick, status  }) => {
  return (
    <button
      onClick={onClick}
      className={
        status === 'full'
          ? 'bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded'
          : 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'
      }
      
    >
      {status == 'full' ? '閲覧' : '参加'}

    </button>
  )
}

export default JoinRoomButton