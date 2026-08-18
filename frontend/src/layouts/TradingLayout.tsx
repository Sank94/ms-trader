import {
  useEffect,
  useRef,
  useState,
} from "react";

import "./TradingLayout.css";

import OptionChain from "../components/OptionChain/OptionChain";
import NiftyChart from "../components/NiftyChart/NiftyChart";

type MarketTick = {
  instrument_token?: number | string;

  last_price?: number | string;

  option?: {
    symbol: string;
    strike: number;
    option_type: "CE" | "PE";
    expiry: string;
    lot_size: number;
  };
};

type SelectedOption = {
  instrument_token: number | string;

  symbol: string;

  strike: number;

  option_type: "CE" | "PE";

  expiry: string;

  lot_size: number;

  last_price: number;
};

const TOKENS = {
  NIFTY: 26000,
  BANK_NIFTY: 26009,
  SENSEX: 51,
  INDIA_VIX: 26017,
};

function TradingLayout() {
  const [prices, setPrices] = useState({
    nifty: null as number | null,
    bankNifty: null as number | null,
    sensex: null as number | null,
    indiaVix: null as number | null,
  });

  const [niftyHistory, setNiftyHistory] =
    useState<number[]>([]);

  const [optionTicks, setOptionTicks] =
    useState<
      Record<string, MarketTick>
    >({});

  const [selectedOption, setSelectedOption] =
    useState<SelectedOption | null>(
      null
    );

  const [connected, setConnected] =
    useState(false);

  const [
    quantity,
    setQuantity,
  ] = useState(65);

  const [
    orderType,
    setOrderType,
  ] = useState<"MARKET" | "LIMIT">(
    "MARKET"
  );

  const [
    limitPrice,
    setLimitPrice,
  ] = useState("");

  /*
   * Keeps the currently selected option
   * available to the WebSocket callback
   * without reconnecting the socket.
   */
  const selectedOptionRef =
    useRef<SelectedOption | null>(
      null
    );

  useEffect(() => {
    selectedOptionRef.current =
      selectedOption;
  }, [selectedOption]);


  /*
   * SINGLE MARKET WEBSOCKET
   */

  useEffect(() => {
    const ws = new WebSocket(
      "ws://127.0.0.1:8000/ws/market"
    );

    ws.onopen = () => {
      console.log(
        "Connected to Falcon market stream"
      );

      setConnected(true);
    };


    ws.onmessage = (event) => {
      try {
        const tick: MarketTick =
          JSON.parse(event.data);

        const token = Number(
          tick.instrument_token
        );

        const price = Number(
          tick.last_price
        );


        /*
         * OPTION TICK
         */

        if (tick.option) {
          if (
            tick.instrument_token !==
            undefined
          ) {
            setOptionTicks(
              (current) => ({
                ...current,

                [String(
                  tick.instrument_token
                )]: tick,
              })
            );
          }


          /*
           * Update selected option LTP
           */

          const currentSelected =
            selectedOptionRef.current;

          if (
            currentSelected &&
            String(
              currentSelected.instrument_token
            ) ===
              String(
                tick.instrument_token
              ) &&
            Number.isFinite(price)
          ) {
            setSelectedOption(
              (current) => {
                if (!current) {
                  return current;
                }

                return {
                  ...current,

                  last_price: price,
                };
              }
            );
          }

          return;
        }


        /*
         * INDEX TICK
         */

        if (!Number.isFinite(price)) {
          return;
        }


        setPrices((current) => {
          switch (token) {
            case TOKENS.NIFTY:
              return {
                ...current,
                nifty: price,
              };

            case TOKENS.BANK_NIFTY:
              return {
                ...current,
                bankNifty: price,
              };

            case TOKENS.SENSEX:
              return {
                ...current,
                sensex: price,
              };

            case TOKENS.INDIA_VIX:
              return {
                ...current,
                indiaVix: price,
              };

            default:
              return current;
          }
        });


        /*
         * NIFTY CHART HISTORY
         *
         * Keep only the latest 300 ticks
         * so memory usage stays tiny.
         */

        if (
          token === TOKENS.NIFTY
        ) {
          setNiftyHistory(
            (current) => {

              const next = [
                ...current,
                price,
              ];

              if (next.length > 300) {
                return next.slice(-300);
              }

              return next;
            }
          );
        }

      } catch (error) {
        console.error(
          "Invalid market tick:",
          error
        );
      }
    };


    ws.onerror = (error) => {
      console.error(
        "Falcon WebSocket error:",
        error
      );

      setConnected(false);
    };


    ws.onclose = () => {
      console.log(
        "Falcon market WebSocket closed"
      );

      setConnected(false);
    };


    return () => {
      ws.close();
    };

  }, []);


  const formatPrice = (
    value: number | null
  ) => {
    if (value === null) {
      return "--";
    }

    return value.toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,

        maximumFractionDigits: 2,
      }
    );
  };


  const handleOptionSelect = (
    option: SelectedOption
  ) => {
    setSelectedOption(option);

    setQuantity(
      option.lot_size
    );

    setLimitPrice(
      option.last_price.toFixed(2)
    );
  };


  return (
    <div className="trading-layout">


      {/* HEADER */}

      <header className="topbar">

        <div className="brand">

          <div className="brand-title">
            🦅 Falcon
          </div>

          <div className="brand-subtitle">
            Options Scalper
          </div>

        </div>


        <div
          className={
            connected
              ? "market-status live"
              : "market-status disconnected"
          }
        >
          ●{" "}
          {connected
            ? "LIVE"
            : "DISCONNECTED"}
        </div>

      </header>


      {/* INDEX TICKER */}

      <section className="market-ticker">


        <div className="ticker-item">

          <span>
            NIFTY 50
          </span>

          <strong>
            {formatPrice(
              prices.nifty
            )}
          </strong>

          <small>
            {prices.nifty !== null
              ? "LIVE TICK"
              : "Waiting"}
          </small>

        </div>


        <div className="ticker-item">

          <span>
            BANK NIFTY
          </span>

          <strong>
            {formatPrice(
              prices.bankNifty
            )}
          </strong>

          <small>
            {prices.bankNifty !== null
              ? "LIVE TICK"
              : "Waiting"}
          </small>

        </div>


        <div className="ticker-item">

          <span>
            SENSEX
          </span>

          <strong>
            {formatPrice(
              prices.sensex
            )}
          </strong>

          <small>
            {prices.sensex !== null
              ? "LIVE TICK"
              : "Waiting"}
          </small>

        </div>


        <div className="ticker-item">

          <span>
            INDIA VIX
          </span>

          <strong>
            {formatPrice(
              prices.indiaVix
            )}
          </strong>

          <small>
            {prices.indiaVix !== null
              ? "LIVE TICK"
              : "Waiting"}
          </small>

        </div>

      </section>


      {/* MAIN WORKSPACE */}

      <main className="workspace">


        {/* WATCHLIST */}

        <aside className="watchlist panel">

          <div className="panel-header">

            <h3>
              Watchlist
            </h3>

          </div>


          <div className="watchlist-list">


            <div className="watchlist-item active">

              <span>
                NIFTY 50
              </span>

              <strong>
                {formatPrice(
                  prices.nifty
                )}
              </strong>

            </div>


            <div className="watchlist-item">

              <span>
                BANK NIFTY
              </span>

              <strong>
                {formatPrice(
                  prices.bankNifty
                )}
              </strong>

            </div>


            <div className="watchlist-item">

              <span>
                SENSEX
              </span>

              <strong>
                {formatPrice(
                  prices.sensex
                )}
              </strong>

            </div>


            <div className="watchlist-item">

              <span>
                INDIA VIX
              </span>

              <strong>
                {formatPrice(
                  prices.indiaVix
                )}
              </strong>

            </div>


          </div>

        </aside>


        {/* CENTER */}

        <section className="center-area">


          {/* OPTION CHAIN */}

          <div className="option-chain-area">

            <OptionChain
              options={
                optionTicks
              }

              connected={
                connected
              }

              selectedOption={
                selectedOption
              }

              onOptionSelect={
                handleOptionSelect
              }
            />

          </div>


          {/* CHART */}

          <div className="chart panel">

            <NiftyChart
              prices={
                niftyHistory
              }

              connected={
                connected
              }
            />

          </div>


        </section>


        {/* ORDER ENTRY */}

        <aside className="order-panel panel">


          <div className="panel-header">

            <h3>
              Order Entry
            </h3>

          </div>


          {!selectedOption ? (

            <div className="order-placeholder">

              <div className="order-placeholder-title">
                No contract selected
              </div>

              <div className="order-placeholder-text">
                Click a CE or PE contract
                from the option chain.
              </div>

            </div>

          ) : (

            <div className="order-form">


              <div className="selected-contract">

                <div className="selected-contract-symbol">

                  {
                    selectedOption.symbol
                  }

                </div>


                <div className="selected-contract-details">

                  NIFTY{" "}

                  {selectedOption.strike.toLocaleString(
                    "en-IN"
                  )}

                  {" "}

                  {
                    selectedOption.option_type
                  }

                </div>

              </div>


              <div className="order-ltp">

                <span>
                  LTP
                </span>

                <strong>

                  ₹
                  {formatPrice(
                    selectedOption.last_price
                  )}

                </strong>

              </div>


              <label className="order-field">

                <span>
                  Quantity
                </span>

                <input
                  type="number"
                  min={
                    selectedOption.lot_size
                  }
                  step={
                    selectedOption.lot_size
                  }
                  value={quantity}
                  onChange={(event) => {

                    const value =
                      Number(
                        event.target.value
                      );

                    if (
                      Number.isFinite(
                        value
                      )
                    ) {
                      setQuantity(
                        value
                      );
                    }

                  }}
                />

                <small>
                  Lot size:{" "}
                  {
                    selectedOption.lot_size
                  }
                </small>

              </label>


              <label className="order-field">

                <span>
                  Order Type
                </span>

                <select
                  value={orderType}
                  onChange={(event) => {

                    setOrderType(
                      event.target
                        .value as
                        | "MARKET"
                        | "LIMIT"
                    );

                  }}
                >

                  <option value="MARKET">
                    MARKET
                  </option>

                  <option value="LIMIT">
                    LIMIT
                  </option>

                </select>

              </label>


              {orderType ===
                "LIMIT" && (

                <label className="order-field">

                  <span>
                    Limit Price
                  </span>

                  <input
                    type="number"
                    step="0.05"
                    value={
                      limitPrice
                    }
                    onChange={
                      (event) =>
                        setLimitPrice(
                          event.target
                            .value
                        )
                    }
                  />

                </label>

              )}


              <div className="order-buttons">

                <button
                  type="button"
                  className="buy-button"
                  onClick={() => {

                    console.log(
                      "BUY TEST",
                      selectedOption,
                      {
                        quantity,
                        orderType,
                        limitPrice,
                      }
                    );

                  }}
                >
                  BUY
                </button>


                <button
                  type="button"
                  className="sell-button"
                  onClick={() => {

                    console.log(
                      "SELL TEST",
                      selectedOption,
                      {
                        quantity,
                        orderType,
                        limitPrice,
                      }
                    );

                  }}
                >
                  SELL
                </button>

              </div>


              <div className="paper-order-warning">

                Paper order only.

                <br />

                No real order will be placed.

              </div>


            </div>

          )}

        </aside>


      </main>


      {/* BOTTOM BAR */}

      <footer className="bottom-panel">


        <div className="bottom-item">

          <span>
            Positions
          </span>

          <strong>
            0
          </strong>

        </div>


        <div className="bottom-item">

          <span>
            Orders
          </span>

          <strong>
            0
          </strong>

        </div>


        <div className="bottom-item">

          <span>
            Holdings
          </span>

          <strong>
            0
          </strong>

        </div>


        <div className="bottom-item">

          <span>
            Funds
          </span>

          <strong>
            --
          </strong>

        </div>


      </footer>


    </div>
  );
}

export default TradingLayout;