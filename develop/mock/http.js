const HEADERS = {
  "Content-Type": "application/json",
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDYyMDcwYzBjZDRjMWMyNzBhODE4MDMiLCJpYXQiOjE2ODQxNDU5MzIsImV4cCI6MTY4NDc1MDczMn0.l8Xtbts-j-f1K4exCqaZv4u8-oF4o7wV8ZS0F-L2B8k",
};

export async function http(param) {
  const base = "https://prometheus-pmcy.onrender.com";
  return await fetch(`${base}${param.url}`, {
    headers: HEADERS,
    method: param.method,
    body: JSON.stringify(param.body),
  }).then((value) => value.json());
}
