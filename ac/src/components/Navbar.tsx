import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand fw-bold" to="/">
        🏭 Factory UI
      </Link>

      <div className="ms-auto d-flex gap-2">
        <Link to="/admin" className="btn btn-outline-light btn-sm">
          Admin
        </Link>

        <Link to="/manager" className="btn btn-outline-light btn-sm">
          Manager
        </Link>

        <Link to="/" className="btn btn-danger btn-sm">
          Logout
        </Link>
      </div>
    </nav>
  );
}