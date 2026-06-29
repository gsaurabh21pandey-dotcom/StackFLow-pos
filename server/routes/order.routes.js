const express = require("express");
const router = express.Router();
const prisma = require("../db/prisma");

// CREATE ORDER
router.post("/", async (req, res) => {
  try {
    const { items , paymentMethod } = req.body;

    let total = 0;

    // 1. calculate total
    for (const item of items) {
      total += item.price * item.qty;
    }
const validMethods = ["Cash", "UPI", "Card"];

if (!validMethods.includes(paymentMethod)) {
  return res.status(400).json({
    message: "Invalid payment method",
  });
}
    // 2. create order + items
    const order = await prisma.order.create({
      data: {
        total,
         paymentMethod: paymentMethod || "Cash",
    status: "Completed",
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            qty: item.qty,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    // 3. reduce stock (🔥 NEW PART)
 for (const item of items) {
  console.log("Reducing stock for product:", item.productId);

  const product = await prisma.product.findUnique({
    where: { id: item.productId }
  });

  if (!product) {
    return res.status(400).json({ error: "Product not found: " + item.productId });
  }

  await prisma.product.update({
    where: { id: item.productId },
    data: {
      stock: product.stock - item.qty,
    },
  });
}
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 