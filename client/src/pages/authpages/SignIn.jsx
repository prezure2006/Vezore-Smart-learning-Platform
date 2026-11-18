import "./signin.css";
const SignIn = () => {
  return (
    <form action="">
      <div className="main-container">
        <h1 className="heading">Enter your details:</h1>
        <label htmlFor="name1">Name</label>
        <input type="text" name="" id="name1" />
        <label htmlFor="login">Email</label>
        <input
          type="text"
          name="login"
          id="login"
          placeholder="Enter your email..."
        />
        <label htmlFor="password">Password</label>
        <input type="text" name="password" id="password" />
      </div>
      <div>
        <button>Submit</button>
      </div>
    </form>
  );
};
export default SignIn;
