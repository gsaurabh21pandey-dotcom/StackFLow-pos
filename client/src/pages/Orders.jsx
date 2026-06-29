import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import { toast } from "react-toastify";
export default function Orders() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
const [paymentMethod, setPaymentMethod] = useState("Cash");
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = (product) => {
  // Product stock finished
  if (product.stock <= 0) {
    setShowOutOfStock(true);

    setTimeout(() => {
      setShowOutOfStock(false);
    }, 2000);

    return;
  }

  const cartItem = cart.find((item) => item.id === product.id);

  // Already added in cart?
  const cartQty = cartItem ? cartItem.qty : 0;

  // Prevent adding more than available stock
  if (cartQty >= product.stock) {
    alert("Cannot add more than available stock.");
    return;
  }

  if (cartItem) {
    setCart(
      cart.map((item) =>
        item.id === product.id
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    );
  } else {
    setCart([
      ...cart,
      {
        ...product,
        qty: 1,
      },
    ]);
  }
};

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Number(item.qty) + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, qty: Number(item.qty) - 1 }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      await api.post("/orders", {
        items: cart.map((item) => ({
          productId: item.id,
          qty: item.qty,
          price: Number(item.price),
        })),
      });

      // alert("Order Placed Successfully ✅");
toast.success("Order Placed Successfully");
      setCart([]);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };
 
const completePayment = async () => {
  if (cart.length === 0) {
    toast.warning("Cart is empty");
    return;
  }

  if (paymentMethod === "Cash") {
    try {
      await api.post("/orders", {
        paymentMethod: "Cash",
        items: cart.map((item) => ({
          productId: item.id,
          qty: item.qty,
          price: Number(item.price),
        })),
      });

      toast.success("Cash Order Placed");
      setShowPayment(false);
      setCart([]);
      fetchProducts();
    } catch (err) {
      console.log(err);
      toast.error("Cash Payment Failed");
    }
    return;
  }

  // Stripe flow
  try {
    localStorage.setItem("cart", JSON.stringify(cart));

    const res = await api.post("/payment/create-checkout-session", {
      products: cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.qty,
      })),
      paymentMethod,
    });

    window.location.href = res.data.url;

  } catch (err) {
    console.log(err);
    toast.error("Payment Failed");
  }
};
  return (
    <Layout>
      <h1>POS Billing</h1>

      <div style={{ display: "flex", gap: "40px" }}>
        {/* PRODUCTS */}
        <div style={{ flex: 1 }}>
          <h2>Products</h2>

          {products.map((product) => (
            <div
              key={product.id}
              style={{
                border: "1px solid gray",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <h3>{product.name}</h3>
              <p>Price: ₹{product.price}</p>
              <p>Stock: {product.stock}</p>

             <button
  onClick={() => addToCart(product)}
  disabled={product.stock === 0}
  style={{
    background: product.stock === 0 ? "#9ca3af" : "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: product.stock === 0 ? "not-allowed" : "pointer",
  }}
>
  {product.stock === 0 ? "Out of Stock" : "Add To Cart"}
</button>
            </div>
          ))}
        </div>

        {/* CART */}
        <div style={{ flex: 1 }}>
          <h2>Cart</h2>

          {cart.length === 0 ? (
            <p>Cart is Empty</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid gray",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <h3>{item.name}</h3>

                <p>
                  Price: ₹{item.price} × {item.qty}
                </p>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => decreaseQty(item.id)}>-</button>
                  <strong>{item.qty}</strong>
                  <button onClick={() => increaseQty(item.id)}>+</button>

                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      marginLeft: "20px",
                      background: "red",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                    }}
                  >
                    Remove
                  </button>
                </div>

                <strong>
                  Subtotal: ₹{item.price * item.qty}
                </strong>
              </div>
            ))
          )}

          <hr />

          <h2>
            Grand Total: ₹
            {cart.reduce(
              (total, item) =>
                total + item.price * item.qty,
              0
            )}
          </h2>

          <button
           onClick={() => {
    if(cart.length===0){
        toast.warning("Cart is Empty");
        return;
    }

    setShowPayment(true);
}}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              background: "green",
              color: "white",
              border: "none",
            }}
          >
            Place Order
          </button>
        </div>
      </div>
      {showOutOfStock && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        background: "#fff",
        padding: "35px",
        borderRadius: "12px",
        textAlign: "center",
        minWidth: "320px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
      }}
    >
      <h2 style={{ color: "#dc2626" }}>
        ⚠ Currently Out of Stock
      </h2>

      <p>This product is unavailable right now.</p>

      <button
        onClick={() => setShowOutOfStock(false)}
        style={{
          marginTop: "15px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        OK
      </button>
    </div>
  </div>
)}
{showPayment && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        background: "#fff",
        width: "420px",
        padding: "30px",
        borderRadius: "15px",
        textAlign: "center",
      }}
    >
      <h2>Select Payment Method</h2>

      <h1 style={{ color: "#2563eb" }}>
        ₹
        {cart.reduce(
          (t, i) => t + i.price * i.qty,
          0
        )}
      </h1>

      <div style={{ marginTop: "20px" }}>
        <label>
          <input
            type="radio"
            value="Cash"
            checked={paymentMethod === "Cash"}
            onChange={(e) =>
              setPaymentMethod(e.target.value)
            }
          />
          Cash
        </label>

        <br />
        <br />

        <label>
          <input
            type="radio"
            value="UPI"
            checked={paymentMethod === "UPI"}
            onChange={(e) =>
              setPaymentMethod(e.target.value)
            }
          />
          UPI
        </label>

        <br />
        <br />

        <label>
          <input
            type="radio"
            value="Card"
            checked={paymentMethod === "Card"}
            onChange={(e) =>
              setPaymentMethod(e.target.value)
            }
          />
          Card
        </label>
      </div>

      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => setShowPayment(false)}
        >
          Cancel
        </button>

        <button
          onClick={completePayment}
          style={{
            background: "green",
            color: "#fff",
            padding: "10px 25px",
            border: "none",
            borderRadius: "8px",
          }}
        >
          Pay Now
        </button>
      </div>
    </div>
  </div>
)}
    </Layout>
  );
}