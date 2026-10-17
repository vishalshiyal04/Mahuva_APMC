import "dotenv/config"; // સૌથી પહેલા: .env લોડ થવી જોઈએ
import http from "http";
import mongoose from "mongoose";
import app from "./app.js";
import { initSocket } from "./socket.js";
import seedAdmin from "./utils/seedAdmin.js";
import seedPages from "./utils/seedPages.js";

const server = http.createServer(app);
initSocket(server);

await mongoose.connect(process.env.MONGO_URI);
await seedAdmin();
await seedPages();
server.listen(process.env.PORT, () =>
  console.log("Server running on", process.env.PORT),
);
