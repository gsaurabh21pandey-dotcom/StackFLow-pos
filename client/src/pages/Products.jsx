import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

 const handleAddProduct = async (e) => {
  e.preventDefault();

  if (!form.name.trim()) {
    toast.error("Product name is required");
    return;
  }

  if (Number(form.price) <= 0) {
    toast.error("Price must be greater than 0");
    return;
  }

  if (Number(form.stock) < 0) {
    toast.error("Stock cannot be negative");
    return;
  }

  try {
   
      if (editingId) {
        await api.put(`/products/${editingId}`, {
          name: form.name,
          price: Number(form.price),
          stock: Number(form.stock),
        });
      } else {
        await api.post("/products", {
          name: form.name,
          price: Number(form.price),
          stock: Number(form.stock),
        });
      }

      setForm({ name: "", price: "", stock: "" });
      setEditingId(null);

      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 Loading UI
  if (loading) {
    return (
      <Layout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          Loading Products...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 style={{ marginBottom: "10px" }}>Products</h1>

      <h3>Total Products: {products.length}</h3>

      {/* SEARCH */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="🔍 Search Product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "300px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* FORM */}
      <form
        onSubmit={handleAddProduct}
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) =>
            setForm({ ...form, stock: e.target.value })
          }
        />

        <button type="submit">
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* TABLE */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
        }}
      >
        <thead style={{ background: "#2563eb", color: "#fff" }}>
          <tr>
            <th style={{ padding: "10px" }}>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products
            .filter((product) =>
              product.name
                .toLowerCase()
                .includes(search.toLowerCase())
            )
            .map((product) => (
              <tr
                key={product.id}
                style={{
                  textAlign: "center",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>₹{product.price}</td>
                <td>{product.stock}</td>

                {/* STATUS */}
                <td>
                  {product.stock === 0 ? (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      🔴 Out of Stock
                    </span>
                  ) : product.stock <= 5 ? (
                    <span style={{ color: "orange", fontWeight: "bold" }}>
                      🟡 Low Stock
                    </span>
                  ) : (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      🟢 In Stock
                    </span>
                  )}
                </td>

                {/* ACTIONS */}
                <td>
                  <button
                    onClick={() => {
                      setEditingId(product.id);
                      setForm({
                        name: product.name,
                        price: product.price,
                        stock: product.stock,
                      });
                    }}
                    style={{
                      background: "#2563eb",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "5px",
                      marginRight: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    style={{
                      background: "#dc2626",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}