import "../App.css";

import OrderPanel from "../components/OrderPanel/OrderPanel";
import Orders from "../components/Orders/Orders";

function OrdersPage() {
  return (
    <>
      <div className="topbar">
        <div>
          <h1>📋 Orders</h1>
          <p>Manage and place your orders</p>
        </div>
      </div>

      <hr />

      <div className="content">
        <div className="left-panel">
          <Orders />
        </div>

        <div className="right-panel">
          <OrderPanel />
        </div>
      </div>
    </>
  );
}

export default OrdersPage;