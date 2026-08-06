import UrlLibrary from "@/app/library/UrlLibrary";
import { handleLogout } from "@/lib/features/userAccount/userAccountSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const dispatch = useAppDispatch();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { checkedLoginStatus, loggedIn, account } = useAppSelector(
    (state) => state.userAccount,
  );

  const renderLoginButton = () => {
    if (!checkedLoginStatus) return null;

    if (loggedIn && account) {
      const { Email } = account;

      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ marginRight: "4px" }}>{Email}</div>
          <div>
            <button
              onClick={() => {
                dispatch(handleLogout());
                navigate(`${UrlLibrary.LOGIN}?ref=${pathname}`);
              }}
            >
              Logout
            </button>
          </div>
        </div>
      );
    } else {
      if (pathname === UrlLibrary.LOGIN) {
        return null;
      } else {
        return (
          <div>
            <button
              onClick={() => {
                navigate(`${UrlLibrary.LOGIN}?ref=${pathname}`);
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
        <div>
          <div className="pointer">Budget</div>
        </div>
        {renderLoginButton()}
      </div>
    </div>
  );
}

export default Navbar;
