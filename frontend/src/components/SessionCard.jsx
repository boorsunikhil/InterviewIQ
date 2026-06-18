
import React from "react";


function SessionCard({ icon, title, desc, color, onClick }) {
  return (
    <div
      className={`card bg-base-100 border-2 border-${color}/30 hover:border-${color} shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group`}
      onClick={onClick}
    >
      <div className="card-body p-6 items-center text-center">
        <div className={`text-5xl mb-3 group-hover:scale-110 transition-transform duration-200`}>
          {icon}
        </div>
        <h3
          className="card-title text-lg font-bold"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {title}
        </h3>
        <p className="text-sm text-base-content/60">{desc}</p>
        <button className={`btn btn-${color} btn-sm mt-3 w-full`}>
          Start Session →
        </button>
      </div>
    </div>
  );
}

export default SessionCard;