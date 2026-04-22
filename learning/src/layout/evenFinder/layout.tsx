import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import Sidebar from "./sidebar";

import "../../styles/evenFinder/layout.css";

export default function EventFinderLayout() {
  return (
    <div id="layout">
      <aside>
        <Sidebar />
      </aside>
      <div className="rootContainer">
        <header>
          <Header />
        </header>
        <main>
          <Outlet />
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </div>
  );
}
