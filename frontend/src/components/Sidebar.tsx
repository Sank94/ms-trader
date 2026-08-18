import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ChartCandlestick,
  ClipboardList,
  Briefcase,
  Wallet,
  Settings,
} from "lucide-react";

function Sidebar() {
  const menuItems = [
    {
      icon: <LayoutDashboard size={18} />,
      name: "Dashboard",
      path: "/",
    },
    {
      icon: <ChartCandlestick size={18} />,
      name: "Market Watch",
      path: "/market-watch",
    },
    {
      icon: <ClipboardList size={18} />,
      name: "Positions",
      path: "/positions",
    },
    {
      icon: <ClipboardList size={18} />,
      name: "Orders",
      path: "/orders",
    },
    {
      icon: <Briefcase size={18} />,
      name: "Holdings",
      path: "/holdings",
    },
    {
      icon: <Wallet size={18} />,
      name: "Funds",
      path: "/funds",
    },
  ];

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-header">
          <h2>Falcon</h2>
          <p>Trading Terminal</p>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <Settings size={18} />
        <span>Settings</span>
      </div>
    </aside>
  );
}

export default Sidebar;