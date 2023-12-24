import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const handler = NextAuth({
	providers: [
		GithubProvider({
			clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || '',
			clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET || '',
		}),
	],
	secret: process.env.NEXT_PUBLIC_SECRET || '',
  callbacks: {
		async signIn({ user, account }) {
			const provider = account?.provider;
			const uid = user?.id;
			const name = user?.name;
			
			try {
				const response = await axios.post(
					`${apiUrl}/auth/${provider}/callback`,
					{
						provider,
						uid,
						name,
						
					}
				);
				if (response.status === 200) {
					return true;
				} else {
					return false;
				}
			} catch (error) {
				console.log('エラー', error);
				return false;
			}
		},
	},
});
export { handler as GET, handler as POST };