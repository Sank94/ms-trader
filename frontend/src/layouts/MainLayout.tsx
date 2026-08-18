import { ReactNode } from "react";

import Sidebar from "../components/Sidebar";
import MarketWatch from "../components/MarketWatch/MarketWatch";

import "../App.css";
import "../components/Sidebar.css";

type MainLayoutProps = {
  children: ReactNode;
};

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="app">
      <Sidebar />

      <div
        style={{
          width: 320,
          padding: "24px",
          borderRight: "1px solid #2f3542",
        }}
      >
        <MarketWatch />
      </div>

      <main
        className="main"
        style={{
          flex: 1,
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default MainLayout;