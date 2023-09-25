import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

interface LoginProps {
  setUsername: (username: string) => void;
  username: string;
}

const Login: React.FC<LoginProps> = ({ setUsername, username }) => {
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    return navigate("/chat");
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <div className="form-control">
        <label htmlFor="username">Enter Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
