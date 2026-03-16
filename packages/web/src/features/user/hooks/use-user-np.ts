import { useQuery } from "@tanstack/react-query";
import { getMyNp } from "../services/user-service";
import { queryKey } from "@/shared/hooks/query-key";

export function useUserNp() {
  return useQuery({
    queryKey: queryKey.np.my_np(),
    queryFn: getMyNp,
    retry: false,
  })
}