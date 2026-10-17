import express from "express";
import cors from "cors";
import adminRoutes from "./routes/admin.routes.js";
import agentRoutes from "./routes/agent.routes.js";
import accountRoutes from "./routes/account.routes.js";
import adminToolsRoutes from "./routes/adminTools.routes.js";
import contentRoutes from "./routes/content.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cropsRoutes from "./routes/crops.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import publicRoutes from "./routes/public.routes.js";
import traderRoutes from "./routes/trader.routes.js";
import adminManageRoutes from "./routes/adminManage.routes.js";
import trendsRoutes from "./routes/trends.routes.js";
import maintenance from "./middleware/maintenance.js";
import maintenanceRoutes from "./routes/maintenance.routes.js";
import settlementsRoutes from "./routes/settlements.routes.js";
import assistantRoutes from "./routes/assistant.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api", maintenance); // મેન્ટેનન્સ ચેક: બધા રૂટ પહેલાં
app.use("/api", adminRoutes);
app.use("/api", agentRoutes);
app.use("/api", authRoutes);
app.use("/api", cropsRoutes);
app.use("/api", paymentRoutes);
app.use("/api", publicRoutes);
app.use("/api", traderRoutes);
app.use("/api", adminManageRoutes);
app.use("/api", accountRoutes);
app.use("/api", adminToolsRoutes);
app.use("/api", contentRoutes);
app.use("/api", maintenanceRoutes);
app.use("/api", trendsRoutes);
app.use("/api", settlementsRoutes);
app.use("/api", assistantRoutes);

export default app;
