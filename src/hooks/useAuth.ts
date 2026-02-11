"use client";

import { useAuthContext } from "@/components/Providers";

export function useAuth() {
  return useAuthContext();
}
