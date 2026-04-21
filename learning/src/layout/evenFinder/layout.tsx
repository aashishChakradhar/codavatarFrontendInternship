import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import Sidebar from "./sidebar";
export default function EventFinderLayout() {
  return (
    <main>
      <Header />
      <Sidebar />
      <Outlet />
      <Footer />
    </main>
  );
}
