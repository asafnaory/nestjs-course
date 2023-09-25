import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ChatWrapper from "./screens/chat-wrapper/ChatWrapper";
import Login from "./screens/login/Login";

const App = () => {
  const [username, setUsername] = useState("");
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login setUsername={setUsername} username={username} />,
    },
    {
      path: "/chat",
      element: <ChatWrapper username={username} />,
    },
  ]);

  return <RouterProvider router={router} />;
};
export default App;
