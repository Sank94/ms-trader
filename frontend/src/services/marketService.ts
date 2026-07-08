export async function getQuote(symbol: string) {
  const response = await fetch(
    `http://127.0.0.1:8000/market/quote?symbol=${symbol}`
  );

  return response.json();
}