import axios, { AxiosResponse, AxiosError } from 'axios'
import { getSession } from 'next-auth/react';

// 認証トークンをヘッダーに付加するfetcher関数
const fetcherWithAuthMessages = async (path: string) => {
  const session = await getSession();
  const token = session?.accessToken;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const url = path
  return axios.get(url, {
    headers: headers,
    withCredentials: true
  })
  .then((res: AxiosResponse) => {
    mutate(res.data, false) })
  .catch((error: AxiosError) => {
    throw error;
  })

};

export default fetcherWith
