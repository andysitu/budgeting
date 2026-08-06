import { Outlet } from "react-router-dom";
import Wrapper from "./components/Wrapper";
import Navbar from "./components/navigation/navbar";
import StoreProvider from "./StoreProvider";

export default function RootLayout() {
  return (
    <StoreProvider>
      <Navbar />
      <Wrapper>
        <Outlet />
      </Wrapper>
    </StoreProvider>
  );
}
