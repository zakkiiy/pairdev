import useSWR from 'swr';
import fetcherWithAuth from '../utils/fetcher';
import { useSession } from 'next-auth/react';
import { getSession } from 'next-auth/react';
import axios from 'axios';
import camelcaseKeys from "camelcase-keys";
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import useCreateMessage from '../hooks/useCreateMessage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionCable from 'actioncable';

interface RoomMessagesProps {
  roomId: string;
}
interface Message {
  id: number;
  content: string;
  user: {
    name: string;
    id: number;
    uid: string;
    avatar_url: string;
  };
  isSender: boolean;
}

const RoomMessages: React.FC<RoomMessagesProps> = ({ roomId }) => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const initialMessagesUrl = `${apiUrl}/api/v1/rooms/${roomId}/messages`;
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  // メッセージ送信用hooks
  const { createMessage, errorMessage } = useCreateMessage(roomId);
  const [messageText, setMessageText] = useState("");
  const websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET


  useEffect(() => {
    const cable = ActionCable.createConsumer(`${websocketUrl}/cable`);
    console.log(cable)
    const subscription = cable.subscriptions.create(
      { channel: 'ChatChannel', room_id: roomId },
      {
        received(data) {
          console.log("受信したデータ:", data);
          const { message } = data;
          setMessages(prev => [...prev, message]) 
        }
      }
    );
  
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // メッセージの取得
  // useStateのmessageの値を更新
  const { data: rawMessages, error } = useSWR(initialMessagesUrl, fetcherWithAuth, {
    onSuccess: (data) => {
      const reversedData = camelcaseKeys(data, { deep: true }).reverse();
      setMessages(reversedData);
    }
  });

  // メッセージ送信用関数とhook
  const handleSend = () => {
    if (messageText.trim()) {
      createMessage(messageText);
      setMessageText("");
    }
  };

  // メッセージ削除
  const handleDeleteMessage = async (messageId: any) => {
    const session = await getSession();
    const token = session?.accessToken;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.delete(`${apiUrl}/api/v1/rooms/${roomId}/messages/${messageId}`, {
        headers: headers,
        withCredentials: true
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error("エラーが発生しました");
    }
  }

  // スクロールが最下部かどうかの判断
  // 違う場合はfalse
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const atBottom = scrollTop + clientHeight === scrollHeight;
      setIsAtBottom(atBottom);
    }
  };

  // refで指定した要素内をスクロールするたびにhandleScrollを呼び出す。（イベントリスナー登録）
  // アンマウント時にイベントリスナーを削除。
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // スクロールが最下部の場合 && メッセージが追加された場合に、自動的に最下部にスクロールする。
  // そうでない場合は、スクロールしない。
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
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {/* メッセージ表示部分 */}
      <div className="flex flex-col space-y-2 overflow-auto flex-grow" ref={messagesContainerRef}>
        {messages.map((message) => {
          const isSender = message.user?.uid === userId;
          return (
            <div
              key={message.id}
              className={`break-words bg-white p-2 rounded-lg shadow ${isSender ? 'ml-auto' : 'mr-auto'}`}
              style={{ maxWidth: '75%', minWidth: '10%' }}
            >
              <div className="flex items-center">
                {/* アバター画像 */}
                <Image
                  src={session?.user?.image ?? ''}
                  height={20}
                  width={20}
                  style={{ borderRadius: '50px' }}
                  alt="User Avatar"
                />
                <p className="text-sm font-medium">{message.user?.name}</p>
              </div>
              <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>
              {/* 削除アイコン */}
              {isSender && (
                <button onClick={() => handleDeleteMessage(message.id)} className="text-red-500 hover:text-red-700">
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              )}
            </div>
          );
        })}
      </div>
      
      {/* ボタンと入力フィールド */}
      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <textarea
            className="flex-1 p-2 border rounded-lg"
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            rows={2}
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
