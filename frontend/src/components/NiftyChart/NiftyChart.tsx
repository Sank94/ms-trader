import { useMemo } from "react";

import "./NiftyChart.css";

type NiftyChartProps = {
  prices: number[];
  connected: boolean;
};

function NiftyChart({
  prices,
  connected,
}: NiftyChartProps) {
  const chart = useMemo(() => {
    if (prices.length < 2) {
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

    const visiblePrices =
      prices.slice(-120);

    const minPrice =
      Math.min(...visiblePrices);

    const maxPrice =
      Math.max(...visiblePrices);

    const range =
      maxPrice - minPrice || 1;

    const points = visiblePrices.map(
      (price, index) => {
        const x =
          paddingLeft +
          (index /
            Math.max(
              visiblePrices.length - 1,
              1
            )) *
            chartWidth;

        const y =
          paddingTop +
          (1 -
            (price - minPrice) /
              range) *
            chartHeight;

        return {
          x,
          y,
          price,
        };
      }
    );

    const linePath = points
      .map((point, index) =>
        `${index === 0 ? "M" : "L"} ${
          point.x
        } ${point.y}`
      )
      .join(" ");

    const areaPath =
      `${linePath} ` +
      `L ${points[points.length - 1].x} ${
        height - paddingBottom
      } ` +
      `L ${points[0].x} ${
        height - paddingBottom
      } Z`;

    const latest =
      points[points.length - 1];

    const gridLines = [0, 1, 2, 3, 4];

    return {
      width,
      height,
      points,
      linePath,
      areaPath,
      latest,
      minPrice,
      maxPrice,
      gridLines,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
      chartWidth,
      chartHeight,
    };
  }, [prices]);

  const latestPrice =
    prices.length > 0
      ? prices[prices.length - 1]
      : null;

  const firstPrice =
    prices.length > 0
      ? prices[0]
      : null;

  const change =
    latestPrice !== null &&
    firstPrice !== null
      ? latestPrice - firstPrice
      : 0;

  const changePercent =
    firstPrice &&
    firstPrice !== 0
      ? (change / firstPrice) * 100
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
          <h3>NIFTY Chart</h3>

          <span>
            Live intraday price
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
          {formatPrice(latestPrice)}
        </div>

        {latestPrice !== null && (
          <div
            className={
              change >= 0
                ? "chart-change positive"
                : "chart-change negative"
            }
          >
            {change >= 0 ? "+" : ""}
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

            {/* GRID */}

            {chart.gridLines.map(
              (line) => {
                const y =
                  chart.paddingTop +
                  (line / 4) *
                    chart.chartHeight;

                const price =
                  chart.maxPrice -
                  (line / 4) *
                    (chart.maxPrice -
                      chart.minPrice);

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


            {/* AREA */}

            <path
              d={chart.areaPath}
              className="chart-area"
            />


            {/* LINE */}

            <path
              d={chart.linePath}
              className="chart-line"
            />


            {/* CURRENT PRICE */}

            <line
              x1={
                chart.paddingLeft
              }
              y1={chart.latest.y}
              x2={
                chart.width -
                chart.paddingRight
              }
              y2={chart.latest.y}
              className="current-price-line"
            />


            <circle
              cx={chart.latest.x}
              cy={chart.latest.y}
              r="5"
              className="current-price-dot"
            />


            {/* CURRENT PRICE LABEL */}

            <rect
              x={
                chart.width -
                chart.paddingRight -
                82
              }
              y={
                chart.latest.y - 12
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
                chart.latest.y + 4
              }
              textAnchor="middle"
              className="current-price-text"
            >
              {latestPrice?.toFixed(2)}
            </text>

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