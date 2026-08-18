import { useEffect, useState } from "react";
import "../App.css";

import { getFunds } from "../services/portfolioService";

type FundData = {
  AVAILABLE_BALANCE: string;
  CLEAR_BALANCE: string;
  AMOUNT_UTILIZED: string;
  PEAK_MARGIN: string;
};

function FundsPage() {
  const [funds, setFunds] = useState<FundData | null>(null);

  useEffect(() => {
    async function loadFunds() {
      try {
        const response = await getFunds();
        setFunds(response.data?.[0] ?? null);
      } catch (error) {
        console.error(error);
      }
    }

    loadFunds();
  }, []);

  return (
    <div className="content">
      <div className="left-panel">
        <h2>Funds</h2>

        <div className="cards">
          <div className="dashboard-card">
            <h3>Available Balance</h3>
            <h2>₹{funds?.AVAILABLE_BALANCE ?? "--"}</h2>
          </div>

          <div className="dashboard-card">
            <h3>Clear Balance</h3>
            <h2>₹{funds?.CLEAR_BALANCE ?? "--"}</h2>
          </div>

          <div className="dashboard-card">
            <h3>Amount Utilized</h3>
            <h2>₹{funds?.AMOUNT_UTILIZED ?? "--"}</h2>
          </div>

          <div className="dashboard-card">
            <h3>Peak Margin</h3>
            <h2>₹{funds?.PEAK_MARGIN ?? "--"}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FundsPage;