'use client'

import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'


interface DeletePostButtonProps {
  id: number;
  apiUrl: any;
  onDeleted: () => void;
}

const DeletePostButton = ({ id, apiUrl, onDeleted }:DeletePostButtonProps ) => {
  const router = useRouter();
  const handleDelete = async () => {
    const session = await getSession();

    const token = session?.accessToken;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    if (window.confirm("OK")) {
      try {
        const response = await axios.delete(`${apiUrl}/api/v1/user_posts/${id}`, {
          headers: headers,
          withCredentials: true
        });
        
        toast.success(response.data.message);
        
      } catch (error) {

      }
      router.push('/user/posts/');
    }
  };
  return (
    <div>
      <button
        onClick={handleDelete}
        className="ml-2 inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-600 bg-white hover:bg-gray-100"
      >
        削除
      </button>
      <ToastContainer />
    </div>
  );
}

export default DeletePostButton