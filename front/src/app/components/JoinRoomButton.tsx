const JoinRoomButton = ({  onClick, status }) => {
  return (
    <button
      onClick={onClick}
      className={status === 'full' ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}
      
    >
      {status == 'full' ? '閲覧' : '参加'}

    </button>
  )
}

export default JoinRoomButton