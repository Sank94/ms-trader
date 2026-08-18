import { useEffect, useState } from "react";
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from "lucide-react";

import "./MarketWatch.css";
import { getQuote } from "../../services/marketService";

type Quote = {
  symbol: string;
  last_price: number;
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
    <div className="watchlist">
      <div className="watchlist-header">
        <TrendingUp size={18} />
        <span>Watchlist</span>
      </div>

      {quotes.map((quote) => {
        const change =
          quote.prev_close !== undefined
            ? quote.last_price - quote.prev_close
            : 0;

        const positive = change >= 0;

        return (
          <div key={quote.symbol} className="watchlist-row">
            <div>
              <strong>
                {quote.symbol
                  .replace("NSE:", "")
                  .replace("BSE:", "")}
              </strong>
            </div>

            <div className={positive ? "positive" : "negative"}>
              {positive ? (
                <ArrowUpRight size={15} />
              ) : (
                <ArrowDownRight size={15} />
              )}

              {quote.last_price.toLocaleString()}
            </div>
          </div>
        );
      })}

      <button className="add-symbol">
        <Plus size={16} />
        Add Symbol
      </button>
    </div>
  );
}

export default MarketWatch;