import { useEffect, useState } from "react";
import "./App.css";
import DashboardCard from "./components/DashboardCard";
import Sidebar from "./components/Sidebar";
import "./components/Sidebar.css";
import MarketWatch from "./components/MarketWatch/MarketWatch";
import OrderPanel from "./components/OrderPanel/OrderPanel";
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
        <div className="topbar">
          <div>
            <h1>🦅 Falcon Trading Terminal</h1>
            <p>Professional Trading Workspace</p>
          </div>

          <div className="topbar-right">
            <div className="status-card">
              <span>Balance</span>
              <strong>₹{dashboard?.available_balance ?? "--"}</strong>
            </div>

            <div className="status-card">
              <span>P&amp;L</span>
              <strong
                style={{
                  color:
                    dashboard && dashboard.todays_pnl >= 0
                      ? "#00c853"
                      : "#ff5252",
                }}
              >
                {dashboard
                  ? `₹${dashboard.todays_pnl.toLocaleString()}`
                  : "--"}
              </strong>
            </div>

            <div className="status-card">
              <span>Status</span>
              <strong style={{ color: "#00c853" }}>🟢 Connected</strong>
            </div>
          </div>
        </div>

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
            <OrderPanel />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;