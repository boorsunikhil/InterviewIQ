import React from "react";
import Logo from "./Logo";
import AboutUs from "../pages/AboutUs";

function AuthNavbar() {
  return (
    <nav className="navbar bg-base-100 border-b border-base-300 px-6">
      <div className="flex items-center gap-2">
        <Logo size={34} />
        <span
          className="text-xl font-extrabold tracking-tight"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Interview<span className="text-primary">IQ</span>
        </span>
        
      </div>
    </nav>
  );
}

export default AuthNavbar;