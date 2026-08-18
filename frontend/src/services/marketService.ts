export async function getLtp(symbol: string) {
  const response = await fetch(
    `http://127.0.0.1:8000/market/ltp?symbol=${encodeURIComponent(symbol)}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch LTP for ${symbol}`);
  }

  return response.json();
}

export async function getQuote(symbol: string) {
  const response = await fetch(
    `http://127.0.0.1:8000/market/quote?symbol=${encodeURIComponent(symbol)}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch quote for ${symbol}`);
  }

  return response.json();
}