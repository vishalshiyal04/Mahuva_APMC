import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { api, getAuth } from "../api.js";

// સૂચનાઓ: પહેલાં સર્વર પાસેથી યાદી, પછી socket થી તરત નવી સૂચના. socket ન ચાલે તો દર 60 સેકન્ડે ફરી લોડ.
export default function useNotifications() {
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    try {
      const d = await api("/notifications");
      setItems(d.items);
      setUnread(d.unread);
    } catch {
      /* નેટવર્ક ભૂલ: આગલી વખતે ફરી */
    }
  }, []);

  useEffect(() => {
    load();
    const poll = setInterval(load, 60000);
    const s = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token: getAuth()?.token },
    });
    s.on("connect", load); // ફરી જોડાતાં વચ્ચેની ચૂકી ગયેલી સૂચના મળી જાય
    s.on("notify:new", (n) => {
      setItems((l) => [n, ...l.filter((x) => x._id !== n._id)].slice(0, 40));
      setUnread((u) => u + 1);
      setToast(n);
      if (
        document.hidden &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        try {
          new Notification(n.title, { body: n.body, tag: String(n._id) });
        } catch {
          /* ignore */
        }
      }
    });
    return () => {
      clearInterval(poll);
      s.close();
    };
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  const markRead = async (n) => {
    if (n.read) return;
    setItems((l) => l.map((x) => (x._id === n._id ? { ...x, read: true } : x)));
    setUnread((u) => Math.max(0, u - 1));
    try {
      await api(`/notifications/${n._id}/read`, "POST");
    } catch {
      load();
    }
  };
  const markAll = async () => {
    setItems((l) => l.map((x) => ({ ...x, read: true })));
    setUnread(0);
    try {
      await api("/notifications/read-all", "POST");
    } catch {
      load();
    }
  };
  const clear = async () => {
    setItems([]);
    setUnread(0);
    try {
      await api("/notifications", "DELETE");
    } catch {
      load();
    }
  };

  return { items, unread, toast, setToast, markRead, markAll, clear };
}
