import { useSession, signIn } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';

interface LoginToViewProps {
  status: "authenticated" | "unauthenticated" | "loading";
}

const LoginToView: React.FC<LoginToViewProps> = ({ status }) => {

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">PairDevへのログイン</h2>
          <p className="text-center text-gray-600 mb-6">続行するには、GitHubアカウントでログインしてください。</p>
          <button
            onClick={() => signIn('github')}
            className="bg-gray-800 text-white px-4 py-2 rounded flex items-center justify-center w-full md:w-auto"
          >
            <FaGithub className="mr-2" /> GitHub
        </button>
        </div>
      </div>
    );
  }
}

export default LoginToView