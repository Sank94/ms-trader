import { useMemo } from "react";

import "./OptionChain.css";

type OptionTick = {
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

type OptionChainProps = {
  options: Record<string, OptionTick>;
  connected: boolean;
  selectedOption: SelectedOption | null;
  onOptionSelect: (
    option: SelectedOption
  ) => void;
};

type OptionRow = {
  strike: number;
  ce?: OptionTick;
  pe?: OptionTick;
};

function OptionChain({
  options,
  connected,
  selectedOption,
  onOptionSelect,
}: OptionChainProps) {

  const rows = useMemo<OptionRow[]>(() => {

    const grouped: Record<
      number,
      OptionRow
    > = {};

    Object.values(options).forEach(
      (option) => {

        if (!option.option) {
          return;
        }

        const strike =
          Number(option.option.strike);

        if (!Number.isFinite(strike)) {
          return;
        }

        if (!grouped[strike]) {
          grouped[strike] = {
            strike,
          };
        }

        if (
          option.option.option_type ===
          "CE"
        ) {
          grouped[strike].ce = option;
        }

        if (
          option.option.option_type ===
          "PE"
        ) {
          grouped[strike].pe = option;
        }
      }
    );

    return Object.values(grouped).sort(
      (a, b) =>
        a.strike - b.strike
    );

  }, [options]);


  const formatPrice = (
    price?: number | string
  ) => {

    if (
      price === undefined ||
      price === null
    ) {
      return "--";
    }

    const value = Number(price);

    if (!Number.isFinite(value)) {
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


  const atmStrike = 24200;


  const expiry = useMemo(() => {

    const firstOption =
      Object.values(options).find(
        (option) =>
          option.option?.expiry
      );

    return (
      firstOption?.option?.expiry ??
      "2026-08-18"
    );

  }, [options]);


  const createSelectedOption = (
    option: OptionTick
  ): SelectedOption | null => {

    if (
      option.instrument_token ===
        undefined ||
      !option.option
    ) {
      return null;
    }

    const price = Number(
      option.last_price
    );

    if (!Number.isFinite(price)) {
      return null;
    }

    return {
      instrument_token:
        option.instrument_token,

      symbol:
        option.option.symbol,

      strike:
        Number(option.option.strike),

      option_type:
        option.option.option_type,

      expiry:
        option.option.expiry,

      lot_size:
        option.option.lot_size,

      last_price:
        price,
    };
  };


  const handleSelect = (
    option: OptionTick | undefined
  ) => {

    if (!option) {
      return;
    }

    const selected =
      createSelectedOption(option);

    if (!selected) {
      return;
    }

    onOptionSelect(selected);
  };


  const isSelected = (
    option: OptionTick | undefined
  ) => {

    if (
      !option ||
      !selectedOption ||
      option.instrument_token ===
        undefined
    ) {
      return false;
    }

    return (
      String(
        option.instrument_token
      ) ===
      String(
        selectedOption.instrument_token
      )
    );
  };


  return (
    <section className="option-chain-container">

      {/* HEADER */}

      <div className="option-chain-header">

        <div>

          <h2>
            NIFTY Option Chain
          </h2>

          <span>
            Expiry: {expiry}
          </span>

        </div>


        <div
          className={
            connected
              ? "option-live"
              : "option-disconnected"
          }
        >
          ●{" "}
          {connected
            ? "LIVE"
            : "DISCONNECTED"}
        </div>

      </div>


      {/* TABLE */}

      <div className="option-table-wrapper">

        <table className="option-table">

          <thead>

            <tr>

              <th colSpan={2}>
                CALLS
              </th>

              <th>
                STRIKE
              </th>

              <th colSpan={2}>
                PUTS
              </th>

            </tr>


            <tr className="sub-header">

              <th>LTP</th>

              <th>Symbol</th>

              <th></th>

              <th>Symbol</th>

              <th>LTP</th>

            </tr>

          </thead>


          <tbody>

            {rows.map((row) => {

              const isATM =
                row.strike ===
                atmStrike;

              return (
                <tr
                  key={row.strike}
                  className={
                    isATM
                      ? "atm-row"
                      : ""
                  }
                >

                  {/* CE PRICE */}

                  <td
                    className={
                      isSelected(row.ce)
                        ? "call-price selected-option"
                        : "call-price"
                    }
                    onClick={() =>
                      handleSelect(row.ce)
                    }
                  >
                    <button
                      type="button"
                      className="option-click"
                      onClick={() =>
                        handleSelect(row.ce)
                      }
                    >
                      {formatPrice(
                        row.ce?.last_price
                      )}
                    </button>
                  </td>


                  {/* CE SYMBOL */}

                  <td
                    className={
                      isSelected(row.ce)
                        ? "option-symbol selected-option"
                        : "option-symbol"
                    }
                    onClick={() =>
                      handleSelect(row.ce)
                    }
                  >
                    <button
                      type="button"
                      className="option-click option-symbol-button"
                      onClick={() =>
                        handleSelect(row.ce)
                      }
                    >
                      {row.ce?.option
                        ?.symbol ??
                        "--"}
                    </button>
                  </td>


                  {/* STRIKE */}

                  <td
                    className={
                      isATM
                        ? "strike atm-strike"
                        : "strike"
                    }
                  >

                    {row.strike.toLocaleString(
                      "en-IN"
                    )}

                    {isATM && (
                      <span className="atm-label">
                        ATM
                      </span>
                    )}

                  </td>


                  {/* PE SYMBOL */}

                  <td
                    className={
                      isSelected(row.pe)
                        ? "option-symbol selected-option"
                        : "option-symbol"
                    }
                    onClick={() =>
                      handleSelect(row.pe)
                    }
                  >
                    <button
                      type="button"
                      className="option-click option-symbol-button"
                      onClick={() =>
                        handleSelect(row.pe)
                      }
                    >
                      {row.pe?.option
                        ?.symbol ??
                        "--"}
                    </button>
                  </td>


                  {/* PE PRICE */}

                  <td
                    className={
                      isSelected(row.pe)
                        ? "put-price selected-option"
                        : "put-price"
                    }
                    onClick={() =>
                      handleSelect(row.pe)
                    }
                  >
                    <button
                      type="button"
                      className="option-click"
                      onClick={() =>
                        handleSelect(row.pe)
                      }
                    >
                      {formatPrice(
                        row.pe?.last_price
                      )}
                    </button>
                  </td>

                </tr>
              );

            })}


            {rows.length === 0 && (

              <tr>

                <td
                  colSpan={5}
                  className="waiting"
                >
                  Waiting for option ticks...
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </section>
  );
}

export default OptionChain;