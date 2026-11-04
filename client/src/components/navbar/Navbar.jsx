import { useNavigate } from "react-router-dom";
import "./navbar.css";
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="container">
      <h1>Vezore</h1>
      <div>
        <input type="text" className="inpt" id="searchf" placeholder="Search" />
      </div>
      <img
        src="https://i.pinimg.com/736x/76/01/f5/7601f57a17473be024d6638225cd2d90.jpg"
        alt=""
        className="pfp-img"
        onClick={() => navigate("/profile")}
      />
    </div>
  );
};
export default Navbar;
