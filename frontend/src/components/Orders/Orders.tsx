import { useEffect, useState } from "react";
import { getOrders } from "../../services/orderService";
import "./Orders.css";

type Order = {
  order_id: string;
  tradingsymbol: string;
  status: string;
  order_type: string;
  quantity: number;
  price: number;
};

function statusColor(status: string) {
  switch (status) {
    case "Pending":
      return "#fbc02d";
    case "Traded":
      return "#00c853";
    case "Rejected":
      return "#ff5252";
    case "Cancelled":
      return "#9e9e9e";
    default:
      return "#ffffff";
  }
}

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    getOrders()
      .then((data) => setOrders(data.data || []))
      .catch(console.error);
  }, []);

  return (
    <div className="orders">
      <h2>📑 Orders</h2>

      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Status</th>
            <th>Type</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {orders.slice(0, 10).map((order) => (
            <tr key={order.order_id}>
              <td>{order.tradingsymbol}</td>

              <td>
                <span
                  style={{
                    background: statusColor(order.status),
                    color: "#111",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    fontSize: "12px",
                  }}
                >
                  {order.status}
                </span>
              </td>

              <td>{order.order_type}</td>
              <td>{order.quantity}</td>
              <td>{order.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Orders;