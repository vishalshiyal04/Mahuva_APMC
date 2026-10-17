// પાના નંબરની યાદી: 1 … 4 5 6 … 20 જેવી (વચ્ચે ખાલી જગ્યાએ '…')
export function pageList(page, pages) {
  const set = [...new Set([1, page - 1, page, page + 1, pages])]
    .filter((n) => n >= 1 && n <= pages)
    .sort((a, b) => a - b);
  const out = [];
  set.forEach((n, i) => {
    if (i && n - set[i - 1] > 1) out.push("…");
    out.push(n);
  });
  return out;
}
