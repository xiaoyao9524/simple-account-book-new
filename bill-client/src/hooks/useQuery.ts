import { useSearchParams } from 'react-router-dom';

export function useQuery() {
  const [searchParams] = useSearchParams();
  const query: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    query[key] = value;
  });
  return query;
}
