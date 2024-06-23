"use client";

import { fetchLoginStatus } from "@/network/login";
import { useRouter } from "next/navigation";
import React, { ReactNode, useCallback, useEffect } from "react";

function Wrapper({ children }: { children: ReactNode }) {
  const router = useRouter();

  const checkLogin = useCallback(async () => {
    const result = await fetchLoginStatus();

    if (!result) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    // Check for login status
    const location = window.location;
    // if (!(location.pathname === "/login")) {
    checkLogin();
    // }
  }, [checkLogin]);
  return <div>{children}</div>;
}

export default Wrapper;
