import { useEffect, useState } from "react";
import "../App.css";

import DashboardCard from "../components/DashboardCard";
import { getDashboard } from "../services/dashboardService";

type DashboardData = {
  available_balance: string;
  open_positions: number;
  open_orders: number;
  todays_pnl: number;
};

function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    getDashboard()
      .then((data) => setDashboard(data.data))
      .catch(console.error);
  }, []);

  return (
    <>
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
    </>
  );
}

export default DashboardPage;