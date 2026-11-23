import { Notification } from "../models/index.js";
import { io } from "../socket.js";

// એક કે અનેક યુઝરને સૂચના મોકલો. મુખ્ય કામ ક્યારેય તૂટે નહીં એટલે ભૂલ ગળી જઈએ છીએ.
export async function notify(
  userIds,
  { type = "info", title, body = "", link = "" },
) {
  try {
    const ids = [...new Set([].concat(userIds).filter(Boolean).map(String))];
    if (!ids.length || !title) return;
    const docs = await Notification.insertMany(
      ids.map((user) => ({ user, type, title, body, link })),
    );
    for (const d of docs) {
      io?.to("user:" + d.user).emit("notify:new", {
        _id: d._id,
        type: d.type,
        title: d.title,
        body: d.body,
        link: d.link,
        read: false,
        createdAt: d.createdAt,
      });
    }
  } catch (e) {
    console.error("notify failed:", e.message);
  }
}
