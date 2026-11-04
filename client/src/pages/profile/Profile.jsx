import "./profile.css";
const Profile = () => {
  return (
    <div className="pfp-container">
      <div>
        <img
          src="https://i.pinimg.com/736x/76/01/f5/7601f57a17473be024d6638225cd2d90.jpg"
          alt=""
          className="pfp-img"
        />
      </div>
      <div className="details-cont">
        <h1>Profile Details</h1>
        <ul>
          <li>Name : Prasheel</li>
          <li>Age : 20</li>
        </ul>
      </div>
    </div>
  );
};
export default Profile;
