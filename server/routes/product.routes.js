const express = require("express");
const router = express.Router();
const prisma = require("../db/prisma");

// GET all products
router.get("/", async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

// POST product
router.post("/", async (req, res) => {
  const { name, price, stock } = req.body;

  const product = await prisma.product.create({
    data: {
      name,
      price: Number(price),
      stock: Number(stock),
    },
  });

  res.json(product);
});

// PUT update
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, stock } = req.body;

  const updated = await prisma.product.update({
    where: { id: Number(id) },
    data: { name, price: Number(price), stock: Number(stock) },
  });

  res.json(updated);
});
// DELETE product
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.product.delete({
    where: {
      id: Number(id),
    },
  });

  res.json({
    message: "Product deleted successfully",
  });
});

module.exports = router;