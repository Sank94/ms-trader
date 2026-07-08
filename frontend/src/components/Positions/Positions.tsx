import { useEffect, useState } from "react";
import { getPositions } from "../../services/portfolioService";
import "./Positions.css";

type Position = {
  tradingsymbol: string;
  quantity: number;
  average_price: number;
  last_price: number;
  pnl: number;
};

function Positions() {
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    getPositions()
      .then((data) => {
        setPositions(data.data.net || []);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="positions">
      <h2>📋 Positions</h2>

      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Qty</th>
            <th>Avg</th>
            <th>LTP</th>
            <th>P&L</th>
          </tr>
        </thead>

        <tbody>
          {positions.map((position) => (
            <tr key={position.tradingsymbol}>
              <td>{position.tradingsymbol}</td>
              <td>{position.quantity}</td>
              <td>{position.average_price}</td>
              <td>{position.last_price}</td>
              <td
                style={{
                  color: position.pnl >= 0 ? "#00c853" : "#ff5252",
                }}
              >
                {position.pnl.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Positions;