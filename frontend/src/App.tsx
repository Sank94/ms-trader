import { useEffect, useState } from "react";
import "./App.css";
import DashboardCard from "./components/DashboardCard";
import Sidebar from "./components/Sidebar";
import "./components/Sidebar.css";
import MarketWatch from "./components/MarketWatch/MarketWatch";
import Positions from "./components/Positions/Positions";
import Orders from "./components/Orders/Orders";
import { getDashboard } from "./services/dashboardService";

type DashboardData = {
  available_balance: string;
  open_positions: number;
  open_orders: number;
  todays_pnl: number;
};

function App() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    getDashboard()
      .then((data) => setDashboard(data.data))
      .catch(console.error);
  }, []);

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <h1>🦅 Falcon Trading Terminal</h1>
        <p>Welcome, Sanketh!</p>

        <hr />

        <div className="content">
          <div className="left-panel">
            <h2>Dashboard</h2>

            <div className="cards">
              <DashboardCard
                title="Available Balance"
                value={`₹${dashboard?.available_balance ?? "Loading..."}`}
              />

              <DashboardCard
                title="Open Positions"
                value={`${dashboard?.open_positions ?? "Loading..."}`}
              />

              <DashboardCard
                title="Open Orders"
                value={`${dashboard?.open_orders ?? "Loading..."}`}
              />

              <DashboardCard
                title="Today's P&L"
                value={
                  dashboard
                    ? `₹${dashboard.todays_pnl.toLocaleString()}`
                    : "Loading..."
                }
                color={
                  dashboard
                    ? dashboard.todays_pnl >= 0
                      ? "#00c853"
                      : "#ff5252"
                    : "white"
                }
              />
            </div>

            <Positions />

            <Orders />
          </div>

          <div className="right-panel">
            <MarketWatch />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;