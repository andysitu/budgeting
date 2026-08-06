import { checkLoginStatus } from "@/lib/features/userAccount/userAccountSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useLocation } from "react-router-dom";
import { ReactNode, useCallback, useEffect } from "react";
import UrlLibrary from "../library/UrlLibrary";

function Wrapper({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  const userAccount = useAppSelector((state) => state.userAccount);
  const { checkingLoginStatus } = userAccount;

  const checkLogin = useCallback(async () => {
    if (!checkingLoginStatus) {
      await dispatch(checkLoginStatus());
    }
  }, [dispatch, checkingLoginStatus]);

  useEffect(() => {
    // Check for login status
    if (!(pathname === UrlLibrary.LOGIN)) {
      checkLogin();
    }
  }, [checkLogin, pathname]);
  return <div>{children}</div>;
}

export default Wrapper;
