const express = require("express");
const cors = require("cors");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const app = express();
const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
app.use(cors());
app.use(express.json());

// routes import
const productRoutes = require("./routes/product.routes");

// routes use
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);
// test route
app.get("/test", (req, res) => {
  res.send("test ok");
});

app.get("/", (req, res) => {
  res.send("API working 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});