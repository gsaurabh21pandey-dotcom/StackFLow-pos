const express = require("express");
const router = express.Router();
const prisma = require("../db/prisma");

// mark order as paid
router.put("/:id/pay", async (req, res) => {
  try {
    const { id } = req.params;

    const orderId = Number(id);

    // 1. check order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 2. update order safely
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
      },
    });

    return res.json(order);

  } catch (err) {
    console.log("PAY ERROR:", err);
    return res.status(500).json({
      message: "Failed to update payment status",
    });
  }
});

module.exports = router;