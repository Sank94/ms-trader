import "../App.css";

import Positions from "../components/Positions/Positions";

function PositionsPage() {
  return (
    <div className="content">
      <div className="left-panel">
        <h2>Positions</h2>
        <Positions />
      </div>
    </div>
  );
}

export default PositionsPage;