import { logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-500 text-white p-4 flex justify-between">
      <h1>Hospital Management</h1>
      <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded">
        Logout
      </button>
    </nav>
  );
}
