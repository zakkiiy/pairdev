import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function Logout() {
	const { data: session, status } = useSession();

	if (status === 'authenticated') {
		return (
			<div>
				<Image
					src={session.user?.image ?? ''}
					height={45}
					width={45}
					style={{ borderRadius: '50px' }}
					alt="User Avatar"
				/>
				<button onClick={() => signOut()}>ログアウト</button>
			</div>
		);
	}
	return null;
}