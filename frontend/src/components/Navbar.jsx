import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Navbar({ user }) {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Continue with local logout.
    }

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="brand">
        <div className="brand-icon">✓</div>
        <span>Task Manager</span>
      </div>

      <div className="nav-user">
        {user?.profilePicture && (
          <img
            src={user.profilePicture}
            alt="Profile"
            className="profile-image"
          />
        )}

        <span>{user?.name}</span>

        <button
          className="logout-button"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;