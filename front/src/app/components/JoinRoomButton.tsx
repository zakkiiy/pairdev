type RoomStatus = 'full' | 'open' | 'joined';


interface JoinRoomButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  status: RoomStatus | string;
  
}

const JoinRoomButton: React.FC<JoinRoomButtonProps> = ({  onClick, status  }) => {
  let buttonText = '';
  let buttonStyle = '';

  switch (status) {
    case 'roomView':
      buttonText = '閲覧';
      buttonStyle = 'bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded';
      break;
    case 'full':
      buttonText = '満員';
      buttonStyle = 'bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded';
      break;
    case 'open':
      buttonText = '参加';
      buttonStyle = 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded';
      break;
    default:
      buttonText = '未定義';
      buttonStyle = 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded';
  }

  return (
    <button onClick={onClick} className={buttonStyle}>
      {buttonText}
    </button>
  );
};

export default JoinRoomButton