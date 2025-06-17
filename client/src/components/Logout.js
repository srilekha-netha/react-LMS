// components/Logout.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any auth tokens or session data here
    localStorage.clear(); // or sessionStorage.clear();

    // Redirect to login page
    navigate("/");
  }, [navigate]);

  return <p>Logging out...</p>;
}

export default Logout;
