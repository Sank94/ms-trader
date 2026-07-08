import { useEffect, useState } from "react";
import { getQuote } from "../../services/marketService";

type Quote = {
  symbol: string;
  last_price: number;
  high: number;
  low: number;
};

function MarketWatch() {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    const symbols = [
      "NSE:NIFTY 50",
      "NSE:NIFTY BANK",
      "NSE:RELIANCE-EQ",
      "NSE:TCS-EQ",
    ];

    async function loadQuotes() {
      const results = await Promise.all(
        symbols.map(async (symbol) => {
          const response = await getQuote(symbol);
          return response.data;
        })
      );

      setQuotes(results);
    }

    loadQuotes();

    const interval = setInterval(loadQuotes, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        background: "#1e1e1e",
        borderRadius: "12px",
        padding: "20px",
        border: "1px solid #333",
      }}
    >
      <h2>📈 Market Watch</h2>

      {quotes.map((quote) => (
        <div
          key={quote.symbol}
          style={{
            borderBottom: "1px solid #333",
            padding: "12px 0",
          }}
        >
          <strong>{quote.symbol}</strong>

          <div>₹ {quote.last_price}</div>

          <small>
            H: {quote.high} | L: {quote.low}
          </small>
        </div>
      ))}
    </div>
  );
}

export default MarketWatch;