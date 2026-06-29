import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useTheme } from "../context/ThemeContext";

export default function Layout({ children }) {
  const { darkMode } = useTheme();

  return (
    <div
      style={{
        display: "flex",
        background: darkMode ? "#0f172a" : "#f3f4f6",
         color: darkMode ? "#ff0909" : "#365aa7",
        transition: "all 0.3s ease",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
        }}
      >
        <Navbar />

        <div
          style={{
            padding: "30px",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}