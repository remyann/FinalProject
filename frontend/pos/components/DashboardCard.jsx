function DashboardCard({ title, value, icon }) {
  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <div className="card-body">
        <h2 className="card-title">
          {title} {icon}
          <div className="badge badge-secondary">NEW</div>
        </h2>
        <p>{value}</p>
      </div>
    </div>
  );
}

export default DashboardCard;
