import { useEffect, useState } from "react";
import { TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import "./MarketWatch.css";
import { getQuote } from "../../services/marketService";

type Quote = {
  symbol: string;
  last_price: number;
  high: number;
  low: number;
  open?: number;
  prev_close?: number;
};

function MarketWatch() {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    Promise.all([
      getQuote("NSE:NIFTY 50"),
      getQuote("NSE:NIFTY BANK"),
      getQuote("BSE:SENSEX"),
    ]).then((responses) => {
      setQuotes(responses.map((r: { data: Quote }) => r.data));
    });
  }, []);

  return (
    <div className="market-watch">
      <h2>
        <TrendingUp size={20} />
        Market Watch
      </h2>

      {quotes.map((quote) => {
        const change =
          quote.prev_close !== undefined
            ? quote.last_price - quote.prev_close
            : 0;

        const positive = change >= 0;

        return (
          <div key={quote.symbol} className="market-card">
            <strong>
              {quote.symbol.replace("NSE:", "").replace("BSE:", "")}
            </strong>

            <h3>{quote.last_price.toLocaleString()}</h3>

            {quote.prev_close !== undefined && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: positive ? "#22c55e" : "#ef4444",
                  fontSize: 14,
                  marginTop: 6,
                  fontWeight: 600,
                }}
              >
                {positive ? (
                  <ArrowUpRight size={16} />
                ) : (
                  <ArrowDownRight size={16} />
                )}

                {positive ? "+" : ""}
                {change.toFixed(2)}
              </div>
            )}

            <div className="market-row">
              <span>Open: {quote.open ?? "-"}</span>
              <span>High: {quote.high}</span>
            </div>

            <div className="market-row">
              <span>Low: {quote.low}</span>
              <span>Prev: {quote.prev_close ?? "-"}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MarketWatch;