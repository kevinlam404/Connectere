import { useState, useEffect } from "react";
import { APP_NAME, APP_MOTTO } from "./config/appConfig";
import Auth from "./components/Auth";
import Chat from "./components/Chat";
import Profile from "./pages/profile";
import FriendRequests from "./pages/friendRequests";


function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [page, setPage] = useState("chat");

  if (!user) {
    return <Auth setUser={setUser} />;
  }

  if (page === "profile") {
    return <Profile user={user} setUser={setUser} setPage={setPage} />;
  }

  if(page === "friendRequests") {
    return <FriendRequests setPage = {setPage} />
  }

  return <Chat user={user} setUser={setUser} setPage={setPage} />;

  useEffect(() => {
    document.title = `${APP_NAME} - ${APP_MOTTO}`;
  }, []);


}

export default App;