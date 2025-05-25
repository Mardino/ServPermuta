import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const error = new Error(
      `Request failed: ${res.status} ${res.statusText}`,
    );

    try {
      (error as any).data = await res.json();
    } catch {
      // Ignore if we can't parse the body
    }

    throw error;
  }
}

export async function apiRequest(
  input: RequestInfo,
  init?: RequestInit,
): Promise<any> {
  const res = await fetch(input, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      "Content-Type": "application/json",
    },
  });

  await throwIfResNotOk(res);

  return res.json();
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => (path: string) => Promise<T> = (options) => async (path) => {
  try {
    const res = await fetch(path);

    if (res.status === 401) {
      if (options.on401 === "returnNull") {
        return null as any;
      } else {
        await throwIfResNotOk(res);
      }
    }

    await throwIfResNotOk(res);

    return res.json();
  } catch (err) {
    console.error(`Failed to fetch ${path}:`, err);
    throw err;
  }
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      queryFn: getQueryFn<any>({ on401: "returnNull" }),
    },
  },
});