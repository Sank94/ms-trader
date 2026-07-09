import "./Sidebar.css";

function Sidebar() {
  const menuItems = [
    { icon: "📊", name: "Dashboard" },
    { icon: "📈", name: "Market Watch" },
    { icon: "📋", name: "Positions" },
    { icon: "📑", name: "Orders" },
    { icon: "💼", name: "Holdings" },
    { icon: "💰", name: "Funds" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>🦅 Falcon</h2>
        <p>Trading Terminal</p>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item, index) => (
          <div
            key={item.name}
            className={`menu-item ${index === 0 ? "active" : ""}`}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        ⚙️ Settings
      </div>
    </aside>
  );
}

export default Sidebar;