import { QueryClient } from '@tanstack/react-query';
// QueryClient holds the cache, default options, and is the backbone of TanStack Query. You configure global defaults here.

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes — data is fresh for 2 min
      gcTime: 1000 * 60 * 10,   // 10 minutes — keep inactive cache for 10 min
      retry: 1,                  // retry once on failure
      refetchOnWindowFocus: true,// refetch when user comes back to tab
    },
  },
});

export default queryClient;