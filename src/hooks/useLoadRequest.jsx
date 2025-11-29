import { useState } from "react";

export function useLoadRequest() {
  const [isLoading, setIsLoading] = useState(false);

  async function request(callback) {
    try {
      setIsLoading(true);
      await callback();
    } finally {
      setIsLoading(false);
    }
  }

  return [isLoading, request];
}
