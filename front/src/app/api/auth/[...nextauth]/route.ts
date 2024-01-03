import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const handler = NextAuth({
	providers: [
		GithubProvider({
			clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || '',
			clientSecret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET || '',
			profile(profile) {
        return {
          id: profile.id,
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url, // avatar_urlをimageプロパティにマッピング
        };
      },
		}),
	],
	session: {
    strategy: "jwt",
    maxAge: 60 * 24 * 24
  },
	secret: process.env.NEXT_PUBLIC_SECRET || '',
  callbacks: {
		async jwt({ token, account, user }) {
			if (account && account.access_token && user) {
				token.id = user.id;
				token.accessToken = account.access_token;
			}
			return token;
		},
		async session({ session, token }) {
			if (token.accessToken && token.id) {
				session.accessToken = token.accessToken;
			}
			return session;
		},
		async signIn({ user, account }) {
			const provider = account?.provider;
			const uid = user?.id;
			const name = user?.name;
			const avatar_url = user?.image; 
			
			try {
				const response = await axios.post(
					`${apiUrl}/auth/${provider}/callback`,
					{
						provider,
						uid,
						name,
						avatar_url
					}
				);
				if (response.status === 200) {
					return true;
				} else {
					return false;
				}
			} catch (error) {
				return false;
			}
		},
	},
});
export { handler as GET, handler as POST };
