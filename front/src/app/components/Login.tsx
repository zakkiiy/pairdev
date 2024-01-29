import React from 'react';
import { useSession, signIn } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';

export default function Login() {
	const { data: session, status } = useSession();

	if (status === 'loading') {
		return <div>Loading...</div>;
	}

	if (status !== 'authenticated') {
    return (
      <div className="text-center">
        <button
          onClick={() => signIn('github')}
          className="bg-gray-800 text-white px-4 py-2 rounded flex items-center justify-center w-full md:w-auto"
        >
          <FaGithub className="mr-2" /> GitHub
        </button>
      </div>
    );
  }
	return null;
}