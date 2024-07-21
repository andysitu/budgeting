"use client";
import { handleLogout } from "@/lib/features/userAccount/userAccountSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter, usePathname } from "next/navigation";

function Navbar() {
  const dispatch = useAppDispatch();

  const pathname = usePathname();
  const router = useRouter();

  const { checkedLoginStatus, loggedIn, account } = useAppSelector(
    (state) => state.userAccount
  );

  const renderLoginButton = () => {
    if (!checkedLoginStatus) return null;

    if (loggedIn && account) {
      const { Email } = account;

      return (
        <div>
          <div>{Email}</div>
          <div>
            <button
              onClick={() => {
                dispatch(handleLogout());
              }}
            >
              Logout
            </button>
          </div>
        </div>
      );
    } else {
      if (pathname === "/login") {
        return null;
      } else {
        return (
          <div>
            <button
              onClick={() => {
                router.push(`/login?ref=${pathname}`);
              }}
            >
              Login
            </button>
          </div>
        );
      }
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>Test</div>
        {renderLoginButton()}
      </div>
    </div>
  );
}

export default Navbar;
