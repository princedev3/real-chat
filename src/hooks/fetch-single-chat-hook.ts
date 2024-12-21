import { useQuery } from "@tanstack/react-query";

interface UserQuery {
  queryKey: string;
  apiUrl: string;
}

export const fetchSingleChat = async ({ apiUrl, queryKey }: UserQuery) => {
  const fetchchatbyId = async () => {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error("Failed to fetch chat");
    }
    return await res.json();
  };
  const { data, status, refetch } = useQuery({
    queryKey: [queryKey],
    queryFn: fetchchatbyId,
    retry: false,
    refetchInterval: false,
  });

  return {
    data,
    status,
    refetch,
  };
};
