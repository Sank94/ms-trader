function Sidebar() {
  const menuItems = [
    "Dashboard",
    "Market Watch",
    "Orders",
    "Positions",
    "Holdings",
    "Funds",
  ];

  return (
    <aside className="sidebar">
      <h2>🦅 Falcon</h2>

      <nav>
        {menuItems.map((item) => (
          <div key={item} className="menu-item">
            {item}
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;