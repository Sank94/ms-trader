const API_URL = "http://127.0.0.1:8000";

export async function getPositions() {
  const response = await fetch(`${API_URL}/portfolio/positions`);

  if (!response.ok) {
    throw new Error("Failed to fetch positions");
  }

  return response.json();
}