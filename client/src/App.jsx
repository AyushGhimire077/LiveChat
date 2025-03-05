import React, { useContext } from "react";
import { ToastContainer } from "react-toastify";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import Homepage from "./pages/Homepage";
import { AppContext } from "./context/AppContext";
import ChatBox from "./components/ChatBox";

const App = () => {
  const { isLogin, isLoading } = useContext(AppContext);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        style={{
          zIndex: 9999,
          position: "absolute",
          right: "10px",
          top: "10px",
        }}
      />
      <BrowserRouter>
        <Routes>
          {isLogin ? (
            <Route path="/" element={<Homepage />}>
              <Route path="chat/:receiverId" element={<ChatBox />} />
            </Route>
          ) : (
            <Route path="/" element={<AuthPage />} />
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
