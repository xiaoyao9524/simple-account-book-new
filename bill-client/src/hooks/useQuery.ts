import { useSearchParams } from 'react-router';

function useQuery() {
  const [searchParams] = useSearchParams();
  const query: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    query[key] = value;
  });
  return query;
}

export default useQuery;
