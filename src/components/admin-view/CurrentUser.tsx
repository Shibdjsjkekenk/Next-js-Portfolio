"use client";

import useCurrentUser from "@/hooks/useCurrentUser";

export default function CurrentUser() {
  useCurrentUser();
  return null;
}
