const API_URL = "http://127.0.0.1:8000";

export type OrderRequest = {
  tradingsymbol: string;
  transaction_type: "BUY" | "SELL";
  quantity: number;
  order_type: "MARKET" | "LIMIT";
  price?: number;
};

export async function getOrders() {
  const response = await fetch(`${API_URL}/orders`);

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  return response.json();
}

export async function placeOrder(order: OrderRequest) {
  const params = new URLSearchParams({
    variety: "REGULAR",
    tradingsymbol: order.tradingsymbol,
    exchange: "NSE",
    transaction_type: order.transaction_type,
    order_type: order.order_type,
    quantity: order.quantity.toString(),
    product: "CNC",
    validity: "DAY",
    price: (order.price ?? 0).toString(),
    trigger_price: "0",
    disclosed_quantity: "0",
    tag: "FALCON",
  });

  const response = await fetch(`${API_URL}/orders/place?${params.toString()}`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to place order");
  }

  return response.json();
}