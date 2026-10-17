import { useEffect, useState } from "react";

// યાદીને પાનાંમાં વહેંચે. items ન હોય (હજી લોડ થાય છે) તો slice પણ undefined.
// resetKey બદલાય (દા.ત. ફિલ્ટર/શોધ) તો પહેલા પાને પાછા જાય.
export default function usePagination(items, initialSize = 10, resetKey) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(initialSize);
  const total = items?.length ?? 0;
  const pages = Math.max(1, Math.ceil(total / size));

  useEffect(() => {
    setPage(1);
  }, [size, resetKey]);
  useEffect(() => {
    if (page > pages) setPage(pages);
  }, [pages, page]); // ડિલીટ પછી પાનું ઘટે

  const slice = items ? items.slice((page - 1) * size, page * size) : items;
  return {
    slice,
    page,
    setPage,
    size,
    setSize,
    pages,
    total,
    sizes: [initialSize, initialSize * 2, initialSize * 5],
  };
}
