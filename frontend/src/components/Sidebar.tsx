import "./Sidebar.css";
import {
  LayoutDashboard,
  ChartCandlestick,
  ClipboardList,
  Briefcase,
  Wallet,
  Landmark,
  Settings,
} from "lucide-react";

function Sidebar() {
  const menuItems = [
    { icon: <LayoutDashboard size={18} />, name: "Dashboard" },
    { icon: <ChartCandlestick size={18} />, name: "Market Watch" },
    { icon: <ClipboardList size={18} />, name: "Positions" },
    { icon: <ClipboardList size={18} />, name: "Orders" },
    { icon: <Briefcase size={18} />, name: "Holdings" },
    { icon: <Wallet size={18} />, name: "Funds" },
  ];

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-header">
          <h2>Falcon</h2>
          <p>Trading Terminal</p>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item, index) => (
            <div
              key={item.name}
              className={`menu-item ${index === 0 ? "active" : ""}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </div>
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