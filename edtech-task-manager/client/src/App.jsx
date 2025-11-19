import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="container">
      <header className="header">
        <h1>EdTech Task Manager</h1>
        <nav className="nav-buttons">
  {!token ? (
    <>
      <Link to="/login" className="btn">Login</Link>
      <Link to="/signup" className="btn">Signup</Link>
    </>
  ) : (
    <>
      <Link to="/dashboard" className="btn">Dashboard</Link>
      <button onClick={logout} className="btn logout-btn">Logout</button>
    </>
  )}
</nav>

      </header>
      <Outlet />
    </div>
  );
}
