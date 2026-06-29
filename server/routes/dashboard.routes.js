const express = require("express");
const router = express.Router();
const prisma = require("../db/prisma");
const authMiddleware = require("../middleware/auth.middleware");

// Apply auth to ALL routes
router.use(authMiddleware);

// Dashboard Statistics
router.get("/", async (req, res) => {
  try {
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.order.count();

    const revenue = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
    });

    const lowStock = await prisma.product.count({
      where: {
        stock: {
          lte: 5,
        },
      },
    });

    res.json({
      totalProducts,
      totalOrders,
      totalRevenue: revenue._sum.total || 0,
      lowStock,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Recent Orders
router.get("/recent-orders", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;