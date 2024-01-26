// import useSWR from 'swr';
// import fetcherWithAuth from '../utils/fetcher'
// import camelcaseKeys from "camelcase-keys";


// const useTags = () => {
//   const apiUrl = process.env.NEXT_PUBLIC_API_URL
//   const url = `${apiUrl}/api/v1/user_posts`
//   const { data: rawPosts, error } = useSWR<Post[]>(url, fetcherWithAuth);
//   const posts = rawPosts ? rawPosts.map((post :Post) => camelcaseKeys(post, {deep:true})) : null;

// }

// export default useTags