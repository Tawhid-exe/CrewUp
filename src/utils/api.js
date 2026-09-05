export default async function fetchJSON(path, options = {}) {
  const res = await fetch(path, options);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}