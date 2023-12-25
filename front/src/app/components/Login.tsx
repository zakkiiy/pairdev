import React from 'react';
import { useSession, signIn } from 'next-auth/react';

export default function Login() {
	const { data: session, status } = useSession();

	if (status === 'loading') {
		return <div>Loading...</div>;
	}

	if (status !== 'authenticated') {
		return (
			<div>
				<p>以下からログインしてください。</p>
				<button onClick={() => signIn('github', {}, { prompt: 'login' })}>
					GitHubでログイン
				</button>
			</div>
		);
	}
	return null;
}