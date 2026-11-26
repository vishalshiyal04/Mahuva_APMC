import express from "express";
import {
  applySecurity,
  errorHandler,
  loginLimiter,
  registerLimiter,
  forgotLimiter,
} from "./middleware/security.js";
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
import notificationsRoutes from "./routes/notifications.routes.js";
import alertsRoutes from "./routes/alerts.routes.js";
import pattiPdfRoutes from "./routes/pattiPdf.routes.js";

const app = express();
applySecurity(app); // helmet, CORS, body limit, NoSQL સફાઈ, rate limit

// અપલોડ થયેલા ફોટા: ફક્ત ફોટા તરીકે જ ખુલે, કોઈ સ્ક્રિપ્ટ ચાલે નહીં
app.use(
  "/uploads",
  express.static("uploads", {
    index: false,
    dotfiles: "deny",
    maxAge: "7d",
    setHeaders: (res) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader(
        "Content-Security-Policy",
        "default-src 'none'; img-src 'self'; sandbox",
      );
    },
  }),
);

// લોગિન / રજીસ્ટ્રેશન / પાસવર્ડ રીસેટ પર brute-force રોકવા
app.use("/api/login", loginLimiter);
app.use("/api/register", registerLimiter);
app.use("/api/forgot", forgotLimiter);

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
app.use("/api", notificationsRoutes);
app.use("/api", alertsRoutes);
app.use("/api", pattiPdfRoutes);

app.use(errorHandler); // છેલ્લે: અંદરની ભૂલ બહાર ન જાય

export default app;
