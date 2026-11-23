import "./signin.css";
import { useState } from "react";
const SignIn = () => {
  const [name1, setName1] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault(); // stops the page from reloading
    // the fucntions whcih is getting called with fetch can aslo send headers
    const res = await fetch("/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name1, email, password }),
    });
    if (!res.ok) {
      console.error(await res.text());
      return;
    }
    const data = await res.json();
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="main-container">
        <h1 className="heading">Login:</h1>

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={password}
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};
export default SignIn;
