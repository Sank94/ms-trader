import { useEffect, useState } from "react";
import { getHoldings } from "../../services/portfolioService";

function Holdings() {
  const [holdings, setHoldings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHoldings() {
      try {
        const response = await getHoldings();

        console.log("HOLDINGS RESPONSE:", response);

        setHoldings(response.data ?? []);
      } catch (error) {
        console.error("HOLDINGS ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadHoldings();
  }, []);

  return (
    <div
      style={{
        border: "1px solid #444",
        borderRadius: "8px",
        padding: "16px",
        marginTop: "20px",
      }}
    >
      <h2>Holdings</h2>

      {loading ? (
        <p>Loading holdings...</p>
      ) : holdings.length === 0 ? (
        <p>No holdings found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Quantity</th>
            </tr>
          </thead>

          <tbody>
            {holdings.map((holding: any, index: number) => (
              <tr key={index}>
                <td>{holding.tradingsymbol}</td>
                <td>{holding.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Holdings;