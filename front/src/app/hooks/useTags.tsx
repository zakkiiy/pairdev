import useSWR from 'swr';
import fetcherWithAuth from '../utils/fetcher'
import camelcaseKeys from "camelcase-keys";

interface Tag {
  id: number
  name: string
}

const useTags = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${apiUrl}/api/v1/tags`
  const { data: rawTags, error } = useSWR<Tag[]>(url, fetcherWithAuth);
  const tags = rawTags ? camelcaseKeys(rawTags, {deep:true}) : null;

  return {
    tags: tags,
    isLoading: !error && !tags,
    isError: error
  }

}

export default useTags