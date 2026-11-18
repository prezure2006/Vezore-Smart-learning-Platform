import "./signup.css";
const SignUp = () => {
  return (
    <form>
      <h1>Enter your details to login</h1>
      <label htmlFor="email">Email</label>
      <input type="text" name="" id="email" placeholder="Enter your email" />
      <label htmlFor="password">Password</label>
      <input
        type="text"
        name=""
        id="password"
        placeholder="Enter your password"
      />
    </form>
  );
};
export default SignUp;
