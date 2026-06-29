import { NavLink } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaBars,
} from "react-icons/fa";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(null);

  const menu = [
    { name: "Dashboard", icon: FaTachometerAlt, path: "/" },
    { name: "Products", icon: FaBoxOpen, path: "/products" },
    { name: "Orders", icon: FaShoppingCart, path: "/orders" },
  ];

  const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    justifyContent: collapsed ? "center" : "flex-start",
    padding: "12px 14px",
    marginBottom: "8px",
    textDecoration: "none",
    borderRadius: "10px",
    color: isActive ? "#111827" : "#6b7280",
    background: isActive ? "#f3f4f6" : "transparent",
    fontWeight: "500",
    position: "relative",
  });

  return (
    <motion.div
      animate={{ width: collapsed ? 80 : 240 }}
      transition={{ type: "spring", stiffness: 260, damping: 25 }}
      style={{
        background: "#ffffff",
        minHeight: "100vh",
        borderRight: "1px solid #e5e7eb",
        padding: "16px",
        overflow: "hidden",
      }}
    >
      {/* Top */}
      <div
        style={{
          display: "flex",
          justifyContent: collapsed ? "center" : "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        {!collapsed && (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: "#111827", fontWeight: "700" }}
          >
            StackFlow
          </motion.h2>
        )}

        <FaBars
          style={{ cursor: "pointer", color: "#6b7280" }}
          onClick={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Menu */}
      {menu.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.name}
            onMouseEnter={() => setHovered(item.name)}
            onMouseLeave={() => setHovered(null)}
          >
            <NavLink to={item.path} style={linkStyle}>
              <Icon size={18} />

              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {item.name}
                </motion.span>
              )}

              {/* Tooltip */}
              {collapsed && hovered === item.name && (
                <div
                  style={{
                    position: "absolute",
                    left: "90px",
                    background: "#111827",
                    color: "#fff",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.name}
                </div>
              )}
            </NavLink>
          </div>
        );
      })}
    </motion.div>
  );
}