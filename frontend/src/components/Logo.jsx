import React from "react";


function Logo({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circle */}
      <circle cx="20" cy="20" r="18" className="fill-primary" opacity="0.15" />
      <circle cx="20" cy="20" r="18" className="stroke-primary" strokeWidth="1.5" fill="none" />
      {/* Brain-like circuit nodes */}
      <circle cx="20" cy="11" r="3" className="fill-primary" />
      <circle cx="29" cy="17" r="2.5" className="fill-primary" opacity="0.8" />
      <circle cx="29" cy="26" r="2.5" className="fill-primary" opacity="0.8" />
      <circle cx="20" cy="30" r="3" className="fill-primary" />
      <circle cx="11" cy="26" r="2.5" className="fill-primary" opacity="0.8" />
      <circle cx="11" cy="17" r="2.5" className="fill-primary" opacity="0.8" />
      <circle cx="20" cy="20" r="3" className="fill-primary" />
      {/* Circuit lines */}
      <line x1="20" y1="14" x2="20" y2="17" className="stroke-primary" strokeWidth="1.5" />
      <line x1="27" y1="18.5" x2="23" y2="19" className="stroke-primary" strokeWidth="1.5" />
      <line x1="27" y1="24.5" x2="23" y2="21" className="stroke-primary" strokeWidth="1.5" />
      <line x1="20" y1="27" x2="20" y2="23" className="stroke-primary" strokeWidth="1.5" />
      <line x1="13" y1="24.5" x2="17" y2="21" className="stroke-primary" strokeWidth="1.5" />
      <line x1="13" y1="18.5" x2="17" y2="19" className="stroke-primary" strokeWidth="1.5" />
    </svg>
  );
}

export default Logo;