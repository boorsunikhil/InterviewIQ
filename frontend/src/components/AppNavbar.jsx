import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import useAuthStore from "../store/AuthStore";




function AppNavbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Handle logout — call backend to clear session then clear store
  const handleLogout = async () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar bg-base-100 border-b border-base-300 px-6 sticky top-0 z-50">
      {/* Left — logo */}
      <div className="navbar-start">
        <Link to="/dashboard" className="flex items-center gap-2">
          <Logo size={32} />
          <span
            className="text-xl font-extrabold tracking-tight"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Interview<span className="text-primary">IQ</span>
          </span>
        </Link>
      </div>

      {/* Right — history + user + logout */}
      <div className="navbar-end gap-3">
        <Link to="/aboutUs" className="btn btn-ghost btn-sm gap-2">
          {/* History icon */}
          
           ℹ️ About Us
        </Link>
        <Link to="/history" className="btn btn-ghost btn-sm gap-2">
          {/* History icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          History
        </Link>

        {/* User avatar chip */}
        <div className="flex items-center gap-2 bg-base-200 px-3 py-1.5 rounded-full">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-7">
              <span className="text-xl font-bold Leading-none ml-1.5"> 
                {user?.username?.[0]?.toUpperCase() ?? "U"}
              </span>
            </div>
          </div>
          <span className="text-sm font-medium hidden sm:block">{user?.username}</span>
        </div>

        <button onClick={handleLogout} className="btn btn-outline btn-sm btn-error">
          Logout
        </button>
      </div>
    </nav>
  );
}


export default AppNavbar;