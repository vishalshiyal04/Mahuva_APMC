import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { api } from "../api.js";

// સાઇટની સ્થિતિ: on = એડમિને મેન્ટેનન્સ ચાલુ કર્યો, down = સર્વર સાથે જોડાણ નથી
export default function useMaintenance() {
  const [m, setM] = useState({ on: false, down: false, ready: false });
  const fails = useRef(0);

  const load = () =>
    api("/maintenance?t=" + Date.now())
      .then((d) => {
        fails.current = 0;
        setM({ ...d, down: false, ready: true });
      })
      .catch(() => {
        fails.current += 1;
        setM((x) => ({ ...x, down: fails.current >= 2, ready: true }));
      });

  useEffect(() => {
    load();
    const s = io();
    s.on("maintenance:update", (d) => {
      fails.current = 0;
      setM({ ...d, down: false, ready: true });
    }); // તરત અપડેટ
    const t = setInterval(load, 20000); // બેકઅપ તપાસ
    return () => {
      s.close();
      clearInterval(t);
    };
  }, []);

  return { ...m, retry: load };
}
