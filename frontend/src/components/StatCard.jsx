import React from "react";

function StatCard({ icon, label, value, desc, color = "primary" }) {
  return (
    <div className={`card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="card-body p-5">
        <div className={`text-${color} text-3xl mb-1`}>{icon}</div>
        <div className="text-3xl font-extrabold" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {value}
        </div>
        <div className="text-sm font-semibold text-base-content/70">{label}</div>
        {desc && <div className="text-xs text-base-content/40 mt-1">{desc}</div>}
      </div>
    </div>
  );
}

export default StatCard;