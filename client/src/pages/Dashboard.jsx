import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStock: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboard();
    fetchRecentOrders();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");
      setStats(res.data || {});
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const res = await api.get("/dashboard/recent-orders");
      setRecentOrders(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const chartData = [
    { name: "Mon", revenue: 400 },
    { name: "Tue", revenue: 300 },
    { name: "Wed", revenue: 600 },
    { name: "Thu", revenue: 200 },
    { name: "Fri", revenue: 800 },
  ];

  const stockData = [
    { name: "In Stock", value: stats.totalProducts - stats.lowStock },
    { name: "Low Stock", value: stats.lowStock },
  ];

  const COLORS = ["#22c55e", "#f59e0b"];

  return (
    <Layout>
      <div className="dash-page">

        <h1 className="dash-title">📊 Dashboard</h1>

        {/* LOADING STATE */}
        {loading ? (
          <div className="loader">Loading dashboard...</div>
        ) : (
          <>
            {/* STATS */}
            <div className="grid">
              <Card title="📦 Products" value={stats.totalProducts} />
              <Card title="🛒 Orders" value={stats.totalOrders} />
              <Card title="💰 Revenue" value={`₹${stats.totalRevenue}`} />
              <Card title="⚠ Low Stock" value={stats.lowStock} danger />
            </div>

            {/* LINE CHART */}
            <div className="card section">
              <h2>📈 Revenue Trend</h2>

              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2563eb"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* PIE CHART */}
            <div className="card section">
              <h2>🥧 Stock Overview</h2>

              <div style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={stockData} dataKey="value" outerRadius={90} label>
                      {stockData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RECENT ORDERS */}
            <div className="card section">
              <h2>🧾 Recent Orders</h2>

              {recentOrders.length === 0 ? (
                <div className="empty">No Recent Orders Found</div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>₹{order.total}</td>
                        <td>{order.status || "Completed"}</td>
                        <td>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>

      {/* STYLES */}
      <style>{`
        .dash-page {
          padding: 24px;
          background: #f9fafb;
          min-height: 100vh;
        }

        .dash-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 20px;
          color: #111827;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .card {
          background: #fff;
          border-radius: 14px;
          padding: 20px;
          border: 1px solid #e5e7eb;
        }

        .section {
          margin-top: 20px;
        }

        .empty {
          text-align: center;
          padding: 20px;
          color: #6b7280;
        }

        .loader {
          padding: 40px;
          text-align: center;
          color: #6b7280;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        th {
          text-align: left;
          padding: 10px;
          background: #f3f4f6;
        }

        td {
          padding: 10px;
          border-top: 1px solid #e5e7eb;
        }
      `}</style>
    </Layout>
  );
}

/* CARD */
function Card({ title, value, danger }) {
  return (
    <div className="card">
      <div style={{ color: "#6b7280", fontSize: "14px" }}>{title}</div>
      <div
        style={{
          fontSize: "22px",
          fontWeight: "700",
          color: danger ? "#ef4444" : "#111827",
        }}
      >
        {value}
      </div>
    </div>
  );
}