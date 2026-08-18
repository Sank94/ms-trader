import "../App.css";

import Holdings from "../components/Holdings/Holdings";

function HoldingsPage() {
  return (
    <div className="content">
      <div className="left-panel">
        <h2>Holdings</h2>
        <Holdings />
      </div>
    </div>
  );
}

export default HoldingsPage;