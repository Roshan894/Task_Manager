import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        await api.get("/auth/me");
        navigate("/dashboard");
      } catch {
        // User is not logged in.
      }
    };

    checkLogin();
  }, [navigate]);

  const googleLogin = () => {
    window.location.href =
      "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo-circle">✓</div>

        <h1>Task Manager</h1>

        <p className="login-subtitle">
          Organize your tasks and stay productive.
        </p>

        <button
          className="google-button"
          onClick={googleLogin}
        >
          <span className="google-icon">G</span>

          Continue with Google
        </button>

        <p className="security-text">
          Sign in securely with your Google account.
        </p>
      </div>
    </div>
  );
}

export default Login;