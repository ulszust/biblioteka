import { useAuth } from "./AuthProvider";

function Footer() {
  const { onLogout } = useAuth();
  return (
    <div className="footer">
      <span className="footer-text">
        Biblioteka Copyrights &copy; ulszust 2022
      </span>
      <button onClick={onLogout}>Wyloguj</button>
    </div>
  );
}

export default Footer;
