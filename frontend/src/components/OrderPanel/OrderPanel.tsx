import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import "./OrderPanel.css";
import { placeOrder } from "../../services/orderService";

function OrderPanel() {
  const [symbol, setSymbol] = useState("");
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState<"MARKET" | "LIMIT">("MARKET");
  const [price, setPrice] = useState("");

  async function handlePlaceOrder() {
    try {
      const response = await placeOrder({
        symbol,
        side,
        quantity,
        order_type: orderType,
        price:
          orderType === "LIMIT" && price
            ? Number(price)
            : undefined,
      });

      alert(response.message ?? "Order placed successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to place order.");
    }
  }

  return (
    <div className="order-panel">
      <h2>
        <ShoppingCart size={20} />
        Place Order
      </h2>

      <label>Symbol</label>
      <input
        type="text"
        placeholder="e.g. RELIANCE"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
      />

      <label>Action</label>
      <select value={side} onChange={(e) => setSide(e.target.value as "BUY" | "SELL")}>
        <option value="BUY">BUY</option>
        <option value="SELL">SELL</option>
      </select>

      <label>Quantity</label>
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />

      <label>Order Type</label>
      <select
        value={orderType}
        onChange={(e) =>
          setOrderType(e.target.value as "MARKET" | "LIMIT")
        }
      >
        <option value="MARKET">MARKET</option>
        <option value="LIMIT">LIMIT</option>
      </select>

      {orderType === "LIMIT" && (
        <>
          <label>Limit Price</label>
          <input
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </>
      )}

      <button
        className={side === "BUY" ? "buy-btn" : "sell-btn"}
        onClick={handlePlaceOrder}
      >
        {side} ORDER
      </button>
    </div>
  );
}

export default OrderPanel;