const SignIn = () => {
  return (
    <form action="">
      <h1>Login</h1>
      <div>
        <label htmlFor="login"></label>
        <input
          type="text"
          name="login"
          id="login"
          placeholder="Enter your email..."
        />
      </div>
      <div>
        <button>Submit</button>
      </div>
    </form>
  );
};
export default SignIn;
