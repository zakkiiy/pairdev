import useSWR from 'swr';
import fetcherWithAuth from '../utils/fetcher';
import { useSession } from 'next-auth/react';
import camelcaseKeys from "camelcase-keys";
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import useCreateMessage from '../hooks/useCreateMessage';

interface RoomMessagesProps {
  roomId: string;
}
interface Message {
  id: number;
  content: string;
  user: {
    name: string;
    id: number;
  };
  isSender: boolean;
}

const RoomMessages: React.FC<RoomMessagesProps> = ({ roomId }) => {
  const { data: session, status } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const initialMessagesUrl = `${apiUrl}/api/v1/rooms/${roomId}/messages`;
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  // メッセージ送信用hooks
  const createMessage = useCreateMessage(roomId);
  const [messageText, setMessageText] = useState("");

  const { data: rawMessages, error } = useSWR(initialMessagesUrl, fetcherWithAuth, {
    onSuccess: (data) => {
      const reversedData = camelcaseKeys(data, { deep: true }).reverse();
      setMessages(reversedData);
    }
  });

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const atBottom = scrollTop + clientHeight === scrollHeight;
      setIsAtBottom(atBottom);
    }
  };

  const handleSend = () => {
    if (messageText.trim()) {
      createMessage(messageText);
      setMessageText(""); // メッセージ送信後、入力フィールドをクリア
    }
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    if (isAtBottom) {
      const container = messagesContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages, isAtBottom]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Image src="/loading.svg" width={500} height={500} alt="loading..." className="animate-spin" />
      </div>
    );
  }

  if (error) return <p className="text-center text-red-500">エラーが発生しました。</p>;

  return (
    <div className="flex flex-col h-auto min-h-[65vh] max-h-[65vh] mx-auto mt-4 mb-4 p-4 bg-gray-200 rounded-lg overflow-auto">
      {/* メッセージ表示部分 */}
      <div className="flex flex-col space-y-2 overflow-auto flex-grow" ref={messagesContainerRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`break-words bg-white p-2 rounded-lg shadow ${message.isSender ? 'ml-auto' : 'mr-auto'}`}
            style={{ maxWidth: '75%', minWidth: '10%' }}
          >
            <p className="text-sm font-medium">{message.user?.name}</p>
            <p className="text-sm">{message.content}</p>
          </div>
        ))}
      </div>
  
      {/* ボタンと入力フィールド */}
      <div className="mt-4">
    <div className="flex items-center space-x-2">
      <input
        type="text"
        className="flex-1 p-2 border rounded-lg"
        placeholder="Type a message..."
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  </div>
    </div>
  );
}

export default RoomMessages;
