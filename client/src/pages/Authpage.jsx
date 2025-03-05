import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext"; 

const AuthPage = () => {
  const { handleLogin, handleRegister } = useContext(AppContext);

  const [isLoginMode, setIsLoginMode] = useState(true); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLoginMode) {
      handleLogin(email, password);
    } else {
      handleRegister(email, password, username);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLoginMode ? "Login" : "Register"}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md"
          >
            {isLoginMode ? "Login" : "Register"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-blue-500"
          >
            {isLoginMode
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
