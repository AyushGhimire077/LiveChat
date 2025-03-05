import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const backendURI = "http://localhost:4000";
  const [isLogin, setIsLogin] = useState(null);
  const [userData, setUserData] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState(null);

  // checkToken
  useEffect(() => {
    const checkToken = async () => {
      try {
        const { data } = await axios.get(`${backendURI}/api/auth/me`, {
          withCredentials: true,
        });
        if (data.success) {
          setIsLogin(true);
          setUserData(data.user);
        } else {
          setIsLogin(false);
        }
      } catch (error) {
        setIsLogin(false);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  // login
  const handleLogin = async (email, password) => {
    try {
      if (!email || !password) {
        toast.error("Please enter email and password");
        return;
      }
      const { data } = await axios.post(
        `${backendURI}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message || "Login successful");
        setIsLogin(true);
        setUserData(data.user);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // register
  const handleRegister = async (email, password, username) => {
    try {
      if (!email || !password || !username) {
        toast.error("Please enter email, password and username");
        return;
      }
      const { data } = await axios.post(
        `${backendURI}/api/auth/register`,
        { email, password, username },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message || "Registration successful");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // logout
  const handleLogout = async () => {
    try {
      const { data } = await axios.get(`${backendURI}/api/auth/logout`, {
        withCredentials: true,
      });
      if (data.success) {
        toast.success(data.message || "Logout successful");
        setIsLogin(false);
        setUserData(null);
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // fetch users
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${backendURI}/api/get-users`, {
        withCredentials: true,
      });
      setUsers(data.users);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // fetch messages
  const fetchMessages = async (receiverId) => {
    if (!receiverId) return;

    try {
      const response = await axios.get(
        `${backendURI}/api/message/fetch-messages/${receiverId}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // send message
  const sendMessage = async (receiverId, message, image) => {
    if (!receiverId || !message) {
      return toast.error("Receiver ID and message are required!");
    }
    try {
      const formData = new FormData();
      formData.append("message", message); 
      formData.append("receiverId", receiverId);

      if (image) {
        formData.append("image", image);      
    }  
      const { data } = await axios.post(
        `${backendURI}/api/message/send/${receiverId}`,
        formData,
        { withCredentials: true }
      );
      if (data.success) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            receiver: receiverId,
            message,
            image: data.image || null,
            createdAt: new Date(),
          },
        ]);
      } else {
        toast.error("Error sending message!");
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false)
    }
  };

  const deleteConversation = async (receiverId) => {
    try {
      const { data } = await axios.delete(
        `${backendURI}/api/message/delete-conversation/${receiverId}`,
        { withCredentials: true }
      );
      if (data.success) {
        setMessages([]);
      } else {
        toast.error("Error deleting conversation!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (receiverId) {
      fetchMessages(receiverId);
    }
  }, [receiverId]);

  const value = {
    handleLogin,
    handleRegister,
    isLogin,
    isLoading,
    handleLogout,
    users,
    userData,
    deleteConversation,
    fetchMessages,
    messages,
    setReceiverId,
    sendMessage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
