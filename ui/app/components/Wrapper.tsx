"use client";

import { checkLoginStatus } from "@/lib/features/userAccount/userAccountSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter, usePathname } from "next/navigation";
import React, { ReactNode, useCallback, useEffect } from "react";

function Wrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const userAccount = useAppSelector((state) => state.userAccount);
  const { checkedLoginStatus } = userAccount;

  const router = useRouter();

  const checkLogin = useCallback(async () => {
    if (!checkedLoginStatus) {
      const test = await dispatch(checkLoginStatus());
    }
  }, [dispatch, checkedLoginStatus]);

  useEffect(() => {
    // Check for login status
    const location = window.location;
    if (!(pathname === "/login")) {
      checkLogin();
    }
  }, [checkLogin, pathname]);
  return <div>{children}</div>;
}

export default Wrapper;
