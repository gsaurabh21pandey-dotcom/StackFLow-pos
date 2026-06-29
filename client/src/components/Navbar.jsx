import { FaBell, FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const { darkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div
      style={{
        height: "70px",
        background: darkMode ? "#1e293b" : "#ffffff",
        color: darkMode ? "#ffffff" : "#111827",
        borderBottom: darkMode ? "1px solid #334155" : "1px solid #e5e7eb",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
        transition: "all 0.3s ease",
      }}
    >
      {/* LEFT */}
      <h2 style={{ fontWeight: "700" }}>
        StackFlow POS
      </h2>

      {/* RIGHT */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: darkMode ? "#fff" : "#111",
          }}
        >
          {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
        </button>

        {/* Bell */}
        <FaBell size={18} />

        {/* User */}
        <span style={{ fontSize: "14px" }}>
          Welcome, <strong>{user?.name}</strong>
        </span>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            background: "#dc2626",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}