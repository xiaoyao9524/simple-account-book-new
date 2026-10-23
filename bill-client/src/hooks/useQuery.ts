import { useSearchParams } from 'react-router';

const useQuery = <T = Record<string, string>>() => {
  const [searchParams] = useSearchParams();
  const query: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    query[key] = value;
  });
  return query as T;
}

export default useQuery;
