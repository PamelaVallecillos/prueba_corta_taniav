export async function getRate(from, to) {
  const url = `https://api.exchangerate.host/latest?base=${encodeURIComponent(from)}&symbols=${encodeURIComponent(to)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error fetching rates');
  const data = await res.json();
  if (!data || !data.rates || data.rates[to] == null) {
    throw new Error('Tasa no disponible');
  }
  return data.rates[to];
}
