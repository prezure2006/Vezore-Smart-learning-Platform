import "./navbar.css";
const Navbar = () => {
  return (
    <div className="container">
      <h1>Vezore</h1>
      <div>
        <label htmlFor="searchf" className="lable-sr">
          Whats on mind:
        </label>
        <input
          type="text"
          className="inpt"
          placeholder="Search for videos..."
          id="searchf"
        />
      </div>
      <a href="#" className="pfp">
        Profile
      </a>
    </div>
  );
};
export default Navbar;
