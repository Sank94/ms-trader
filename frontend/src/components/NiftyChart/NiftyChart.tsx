import { useMemo } from "react";

import "./NiftyChart.css";


type NiftyCandle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};


type NiftyChartProps = {
  prices?: number[];
  candles?: NiftyCandle[];
  connected: boolean;
};


function NiftyChart({
  prices = [],
  candles = [],
  connected,
}: NiftyChartProps) {

  /*
   * If candles are available, use them.
   *
   * Otherwise fall back to the existing
   * live-price history used by TradingLayout.
   */
  const chartCandles = useMemo(() => {

    if (candles.length > 0) {
      return candles.slice(-120);
    }

    /*
     * Backward-compatible fallback.
     *
     * The current TradingLayout still supplies
     * individual NIFTY prices.
     */
    if (prices.length === 0) {
      return [];
    }

    const now = Date.now();

    const startTime =
      now -
      Math.max(
        prices.length - 1,
        0
      ) *
        1000;

    const candleMap =
      new Map<
        number,
        NiftyCandle
      >();


    prices.forEach(
      (price, index) => {

        if (
          !Number.isFinite(price)
        ) {
          return;
        }

        const timestamp =
          startTime +
          index * 1000;

        const minute =
          Math.floor(
            timestamp / 60000
          ) * 60000;


        const existing =
          candleMap.get(minute);


        if (!existing) {

          candleMap.set(
            minute,
            {
              time: minute,
              open: price,
              high: price,
              low: price,
              close: price,
            }
          );

          return;
        }


        existing.high =
          Math.max(
            existing.high,
            price
          );

        existing.low =
          Math.min(
            existing.low,
            price
          );

        existing.close =
          price;
      }
    );


    return Array.from(
      candleMap.values()
    ).slice(-120);

  }, [prices, candles]);


  const chart = useMemo(() => {

    if (
      chartCandles.length === 0
    ) {
      return null;
    }


    const width = 1000;
    const height = 360;

    const paddingLeft = 55;
    const paddingRight = 20;
    const paddingTop = 25;
    const paddingBottom = 35;


    const chartWidth =
      width -
      paddingLeft -
      paddingRight;


    const chartHeight =
      height -
      paddingTop -
      paddingBottom;


    const minPrice =
      Math.min(
        ...chartCandles.map(
          (candle) =>
            candle.low
        )
      );


    const maxPrice =
      Math.max(
        ...chartCandles.map(
          (candle) =>
            candle.high
        )
      );


    const range =
      maxPrice -
        minPrice ||
      1;


    const candleWidth =
      chartWidth /
      Math.max(
        chartCandles.length,
        1
      );


    const bodyWidth =
      Math.max(
        3,
        candleWidth * 0.55
      );


    const mappedCandles =
      chartCandles.map(
        (
          candle,
          index
        ) => {

          const centerX =
            paddingLeft +
            index *
              candleWidth +
            candleWidth / 2;


          const openY =
            paddingTop +
            (
              1 -
              (
                candle.open -
                minPrice
              ) /
                range
            ) *
              chartHeight;


          const highY =
            paddingTop +
            (
              1 -
              (
                candle.high -
                minPrice
              ) /
                range
            ) *
              chartHeight;


          const lowY =
            paddingTop +
            (
              1 -
              (
                candle.low -
                minPrice
              ) /
                range
            ) *
              chartHeight;


          const closeY =
            paddingTop +
            (
              1 -
              (
                candle.close -
                minPrice
              ) /
                range
            ) *
              chartHeight;


          const bodyTop =
            Math.min(
              openY,
              closeY
            );


          const bodyHeight =
            Math.max(
              Math.abs(
                closeY -
                  openY
              ),
              1
            );


          return {
            ...candle,
            centerX,
            openY,
            highY,
            lowY,
            closeY,
            bodyTop,
            bodyHeight,
          };
        }
      );


    return {
      width,
      height,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
      chartWidth,
      chartHeight,
      minPrice,
      maxPrice,
      bodyWidth,
      candles:
        mappedCandles,
    };

  }, [chartCandles]);


  const latestPrice =
    chartCandles.length > 0
      ? chartCandles[
          chartCandles.length - 1
        ].close
      : null;


  const firstPrice =
    chartCandles.length > 0
      ? chartCandles[0].open
      : null;


  const change =
    latestPrice !== null &&
    firstPrice !== null
      ? latestPrice -
        firstPrice
      : 0;


  const changePercent =
    firstPrice !== null &&
    firstPrice !== 0
      ? (
          change /
          firstPrice
        ) *
        100
      : 0;


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


  return (
    <section className="nifty-chart">

      <div className="nifty-chart-header">

        <div>

          <h3>
            NIFTY Chart
          </h3>

          <span>
            Live 1-minute candles
          </span>

        </div>


        <div
          className={
            connected
              ? "chart-status live"
              : "chart-status disconnected"
          }
        >
          ●{" "}
          {connected
            ? "LIVE"
            : "DISCONNECTED"}
        </div>

      </div>


      <div className="chart-summary">

        <div className="chart-price">

          {formatPrice(
            latestPrice
          )}

        </div>


        {latestPrice !== null && (
          <div
            className={
              change >= 0
                ? "chart-change positive"
                : "chart-change negative"
            }
          >

            {change >= 0
              ? "+"
              : ""}

            {change.toFixed(2)}

            {" "}

            (
            {changePercent >= 0
              ? "+"
              : ""}

            {changePercent.toFixed(2)}
            %)

          </div>
        )}

      </div>


      <div className="chart-canvas">

        {chart ? (

          <svg
            viewBox={`0 0 ${chart.width} ${chart.height}`}
            preserveAspectRatio="none"
            className="nifty-chart-svg"
          >

            {/* PRICE GRID */}

            {[0, 1, 2, 3, 4].map(
              (line) => {

                const y =
                  chart.paddingTop +
                  (line / 4) *
                    chart.chartHeight;


                const price =
                  chart.maxPrice -
                  (line / 4) *
                    (
                      chart.maxPrice -
                      chart.minPrice
                    );


                return (
                  <g key={line}>

                    <line
                      x1={
                        chart.paddingLeft
                      }
                      y1={y}
                      x2={
                        chart.width -
                        chart.paddingRight
                      }
                      y2={y}
                      className="chart-grid"
                    />


                    <text
                      x="8"
                      y={y + 4}
                      className="chart-axis-label"
                    >
                      {price.toFixed(2)}
                    </text>

                  </g>
                );
              }
            )}


            {/* CANDLESTICKS */}

            {chart.candles.map(
              (candle) => {

                const bullish =
                  candle.close >=
                  candle.open;


                return (
                  <g
                    key={
                      candle.time
                    }
                  >

                    {/* WICK */}

                    <line
                      x1={
                        candle.centerX
                      }
                      y1={
                        candle.highY
                      }
                      x2={
                        candle.centerX
                      }
                      y2={
                        candle.lowY
                      }
                      className={
                        bullish
                          ? "candle-wick bullish"
                          : "candle-wick bearish"
                      }
                    />


                    {/* BODY */}

                    <rect
                      x={
                        candle.centerX -
                        chart.bodyWidth /
                          2
                      }
                      y={
                        candle.bodyTop
                      }
                      width={
                        chart.bodyWidth
                      }
                      height={
                        candle.bodyHeight
                      }
                      className={
                        bullish
                          ? "candle-body bullish"
                          : "candle-body bearish"
                      }
                    />

                  </g>
                );
              }
            )}


            {/* CURRENT PRICE */}

            {latestPrice !== null &&
              chart.candles.length >
                0 && (

              (() => {

                const y =
                  chart.paddingTop +
                  (
                    1 -
                    (
                      latestPrice -
                      chart.minPrice
                    ) /
                      (
                        chart.maxPrice -
                        chart.minPrice ||
                        1
                      )
                  ) *
                    chart.chartHeight;


                return (
                  <>

                    <line
                      x1={
                        chart.paddingLeft
                      }
                      y1={y}
                      x2={
                        chart.width -
                        chart.paddingRight
                      }
                      y2={y}
                      className="current-price-line"
                    />


                    <circle
                      cx={
                        chart.candles[
                          chart.candles.length -
                            1
                        ].centerX
                      }
                      cy={y}
                      r="4"
                      className="current-price-dot"
                    />


                    <rect
                      x={
                        chart.width -
                        chart.paddingRight -
                        82
                      }
                      y={
                        y - 12
                      }
                      width="78"
                      height="24"
                      rx="4"
                      className="current-price-label"
                    />


                    <text
                      x={
                        chart.width -
                        chart.paddingRight -
                        43
                      }
                      y={
                        y + 4
                      }
                      textAnchor="middle"
                      className="current-price-text"
                    >
                      {latestPrice.toFixed(
                        2
                      )}
                    </text>

                  </>
                );

              })()

            )}

          </svg>

        ) : (

          <div className="chart-empty">

            <div>
              Waiting for NIFTY ticks...
            </div>

            <span>
              Live chart will appear
              automatically.
            </span>

          </div>

        )}

      </div>

    </section>
  );
}


export default NiftyChart;
