type DashboardCardProps = {
  title: string;
  value: string;
  color?: string;
};

function DashboardCard({
  title,
  value,
  color = "white",
}: DashboardCardProps) {
  return (
    <div
      style={{
        background: "#1e1e1e",
        padding: "20px",
        borderRadius: "10px",
        minHeight: "90px",
      }}
    >
      <h3
        style={{
          marginBottom: "10px",
          color: "#ddd",
        }}
      >
        {title}
      </h3>

      <h2
        style={{
          margin: 0,
          color: color,
        }}
      >
        {value}
      </h2>
    </div>
  );
}

export default DashboardCard;