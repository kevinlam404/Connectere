import { useEffect, useState, useRef } from "react";
import axios from "axios";
import socket from "../socket";
import { APP_NAME, APP_MOTTO } from "../config/appConfig";
import AnimatedLogo from "./AnimatedLogo";
import ProfilePopover from "./ProfilePopover";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

function Chat({ user, setUser, setPage }) {
  const isMobile = useIsMobile();
  const [room, setRoom] = useState("general");
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [image, setImage] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [friendsOpen, setFriendsOpen] = useState(false);
  const bottomRef = useRef(null);
  const typingRef = useRef(null);
  const allRooms = [...new Set([...rooms, room])];
  const username = user?.username || "";
  const avatar = user?.avatar || "";

  //Connect + Load data
  useEffect(() => {
    if (!user) return;

    const handleDelete = (messageId) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    };

    const handleMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    const handleUsers = (users) => {
      setOnlineUsers(users || []);
    };

    let typingTimeout;

    const handleTyping = (username) => {
      setTypingUser(username);

      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        setTypingUser("");
      }, 1000);
    };

    //Join room
    socket.emit("join_room", {
      room,
      username: user.username,
      avatar: user.avatar,
    });

    //Load messages
    const loadMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/messages/${room}`,
        );
        setMessages(res.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    loadMessages();

    //Listeners
    socket.on("receive_msg", handleMessage);
    socket.on("online_users", handleUsers);
    socket.on("user_typing", handleTyping);
    socket.on("delete_msg", handleDelete);

    socket.on("room_list", (rooms) => {
      setRooms(rooms);
    });

    //Cleanup
    return () => {
      socket.emit("leave_room", room);

      socket.off("receive_msg", handleMessage);
      socket.off("online_users", handleUsers);
      socket.off("user_typing", handleTyping);
      socket.off("room_list");
      socket.off("delete_msg", handleDelete);
    };
  }, [user, room]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //Friends list
  useEffect(() => {
    const fetchFriends = async () => {
      const res = await axios.get("http://localhost:5000/api/friends", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setFriends(res.data);
    };

    fetchFriends();
  }, []);

  //Send Message
  const sendMessage = async () => {
    if (!message.trim() && !image) return;

    let imageUrl = "";

    try {
      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        const res = await axios.post(
          "http://localhost:5000/api/upload/image",
          formData,
        );

        imageUrl = res.data.imageUrl;
      }

      const msgData = {
        room,
        username: username,
        avatar: avatar,
        bio: user.bio,
        status: user.status,
        text: message,
        image: imageUrl,
        time: new Date().toLocaleTimeString(),
      };

      socket.emit("send_msg", msgData);

      setMessage("");
      setImage(null);
    } catch (err) {
      console.log(err);
    }
  };

  //Logout
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const createRoom = () => {
    if (!newRoom.trim()) return;
    socket.emit("create_room", newRoom);
    setNewRoom("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  //UI
  return (
    <div
      className="flex h-screen w-screen overflow-hidden text-white relative page"
      style={{ background: "#0a0a0a" }}
    >
      {/* Silver orbs*/}
      <div
        className="fixed pointer-none glow float"
        style={{
          top: "-180px",
          left: "-120px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.18), rgba(180,180,180,0.06) 50%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: "-160px",
          right: "-100px",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 60% 60%, rgba(255,255,255,0.15), rgba(160,160,160,0.05) 50%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          top: "50%",
          left: "42%",
          transform: "translate(-50%,-50%)",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.09), rgba(200,200,200,0.03) 55%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: "5%",
          left: "15%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08), transparent 65%)",
          filter: "blur(35px)",
        }}
      />

      {/* Mobile backdrop for sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 35 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile backdrop for friends panel */}
      {friendsOpen && (
        <div
          className="fixed inset-0"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 35 }}
          onClick={() => setFriendsOpen(false)}
        />
      )}

      {(sidebarOpen || friendsOpen) && (
        <div
          className="fixed inset-0"
          style={{
            background: "rgba(0,0,0,0.5)",
            zIndex: 35,
          }}
          onClick={() => {
            setSidebarOpen(false);
            setFriendsOpen(false);
          }}
        />
      )}

      {/* SIDEBAR */}
      <div
        className="flex flex-col gap-1 py-5 px-3 glass float"
        style={{
          width: "240px",
          minWidth: "240px",
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          ...(isMobile
            ? {
                position: "fixed",
                top: 0,
                left: 0,
                height: "100%",
                zIndex: 40,
                transition: "transform 0.25s ease",
              }
            : {
                position: "relative",
                flexShrink: 0,
              }),
        }}
      >
        <div className="px-3 pb-4 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-white/80">{APP_NAME}</h1>
            <p className="text-xs text-white/30">{APP_MOTTO}</p>
          </div>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.5)",
                fontSize: 18,
                cursor: "pointer",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          )}
        </div>

        <AnimatedLogo />

        <p
          className="px-3 pb-3 text-[11px] font-semibold tracking-[0.2em] uppercase"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          Channels
        </p>

        {allRooms.map((r, i) => (
          <button
            key={i}
            onClick={() => {
              setRoom(r);
              if (isMobile) setSidebarOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium"
            style={{
              cursor: "pointer",
              transition: "all 0.18s ease",
              background: room === r ? "rgba(255,255,255,0.1)" : "transparent",
              color:
                room === r ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.4)",
            }}
            onMouseEnter={(e) => {
              if (room !== r) {
                e.target.style.background = "rgba(255,255,255,0.08)";
                e.target.style.color = "rgba(255,255,255,0.85)";
                e.target.style.transform = "translateX(4px)";
              }
            }}
            onMouseLeave={(e) => {
              if (room !== r) {
                e.target.style.background = "transparent";
                e.target.style.color = "rgba(255,255,255,0.4)";
                e.target.style.transform = "translateX(0px)";
              }
            }}
          >
            # {r}
          </button>
        ))}

        <div
          className="flex flex-col gap-1.5 mt-2 pt-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <input
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createRoom()}
            placeholder="New channel..."
            className="w-full px-3 py-2 rounded-xl text-sm outline-none transition-all duration-150"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "white",
            }}
          />
          <button
            onClick={createRoom}
            className="w-full py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255,255,255,0.12)";
              e.target.style.borderColor = "rgba(255,255,255,0.25)";
              e.target.style.color = "rgba(255,255,255,0.9)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255,255,255,0.07)";
              e.target.style.borderColor = "rgba(255,255,255,0.12)";
              e.target.style.color = "rgba(255,255,255,0.7)";
            }}
          >
            + Create
          </button>
        </div>

        {/* User + logout */}
        <div
          className="mt-auto pt-3 flex flex-col gap-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div
            onClick={() => setPage("profile")}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              cursor: "pointer",
              transition: "all 0.18s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(255,255,255,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${user?.username}&background=222&color=fff`
              }
              alt=""
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                objectFit: "cover",
                border: "1px solid rgba(255,255,255,0.2)",
                flexShrink: 0,
              }}
            />

            <div className="flex flex-col overflow-hidden">
              <span
                className="text-sm font-semibold truncate"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                {user?.username}
              </span>

              <span
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                Edit profile
              </span>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.4)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255,255,255,0.10)";
              e.target.style.borderColor = "rgba(255,255,255,0.18)";
              e.target.style.color = "rgba(255,255,255,0.75)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255,255,255,0.04)";
              e.target.style.borderColor = "rgba(255,255,255,0.08)";
              e.target.style.color = "rgba(255,255,255,0.4)";
            }}
          >
            Sign out
          </button>
        </div>

        {/* Online */}
        <div className="mt-3">
          <p
            className="text-[10px] font-semibold tracking-[0.16em] uppercase px-1 mb-2"
            style={{ color: "rgba(255,255,255,0.22)" }}
          >
            Online — {onlineUsers.length}
          </p>
          {onlineUsers.map((u, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-2 py-1.5 text-sm"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: "#6ee7b7", boxShadow: "0 0 6px #6ee7b7" }}
              />
              {u.username}
            </div>
          ))}
        </div>
      </div>

      {/* CHAT PANEL */}
      <div
        className="flex-1 flex flex-col overflow-hidden relative z-5 glass page"
        style={{
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{
            background: "rgba(255,255,255,0.04)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Hamburger — mobile only */}
          {isMobile && (
            <button
              onClick={() => {
                setSidebarOpen(true);
                setFriendsOpen(false);
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.7)",
                fontSize: 20,
                cursor: "pointer",
                padding: "4px 8px",
              }}
            >
              ☰
            </button>
          )}

          <div className="flex items-center gap-2">
            <span
              className="text-xl font-bold"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              #
            </span>
            <span
              className="text-base font-semibold"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              {room}
            </span>
          </div>

          {/* Friends toggle — mobile only */}
          {isMobile && (
            <button
              onClick={() => {
                setFriendsOpen(true);
                setSidebarOpen(false);
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.7)",
                fontSize: 18,
                cursor: "pointer",
                padding: "4px 8px",
              }}
            >
              👥
            </button>
          )}

          {!isMobile && <div className="flex items-center gap-3"></div>}
        </div>

        {/* Messages */}
        <div
          className="flex-1 flex flex-col gap-2 px-6 py-5 overflow-y-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.08) transparent",
          }}
        >
          {messages.map((msg, i) => {
            const mine = msg.username === username;

            return (
              <div
                key={i}
                className={`flex items-end gap-3 ${
                  mine ? "justify-end" : "justify-start"
                }`}
              >
                {/* OTHER USER AVATAR */}
                {!mine && (
                  <img
                    src={
                      msg.avatar ||
                      `https://ui-avatars.com/api/?name=${msg.username}&background=111827&color=fff`
                    }
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border border-white/10 cursor-pointer"
                    onClick={async () => {
                      try {
                        const res = await axios.get(
                          `http://localhost:5000/api/users/${msg.username}`,
                        );

                        setSelectedUser(res.data);
                        setShowProfile(true);
                      } catch (err) {
                        console.log(err);
                      }
                    }}
                  />
                )}

                {/* MESSAGE */}
                <div
                  className="flex flex-col gap-1 px-4 py-2.5"
                  style={{
                    maxWidth: isMobile ? "80%" : "60%",
                    borderRadius: mine
                      ? "20px 20px 4px 20px"
                      : "20px 20px 20px 4px",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    background: mine
                      ? "rgba(255,255,255,0.13)"
                      : "rgba(255,255,255,0.06)",
                    border: mine
                      ? "1px solid rgba(255,255,255,0.2)"
                      : "1px solid rgba(255,255,255,0.08)",
                    boxShadow: mine
                      ? "0 4px 24px rgba(255,255,255,0.06)"
                      : "0 4px 20px rgba(0,0,0,0.3)",
                  }}
                >
                  <span
                    className="text-[11px] font-semibold tracking-wider uppercase"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  >
                    {msg.username}
                  </span>

                  {msg.text && (
                    <span
                      className="text-sm leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.85)" }}
                    >
                      {msg.text}
                    </span>
                  )}

                  {msg.image && (
                    <img
                      src={msg.image}
                      className="rounded-xl mt-1.5 w-48"
                      style={{
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                      alt=""
                    />
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 4,
                      gap: 10,
                    }}
                  >
                    <span
                      className="text-[10px]"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      {msg.time}
                    </span>

                    {mine && (
                      <button
                        onClick={() =>
                          socket.emit("delete_msg", {
                            messageId: msg._id,
                            room,
                          })
                        }
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "rgba(255,255,255,0.35)",
                          cursor: "pointer",
                          fontSize: 12,
                        }}
                      >
                        🗑
                      </button>
                    )}
                  </div>
                </div>

                {/* MY AVATAR */}
                {mine && (
                  <img
                    src={
                      user.avatar ||
                      `https://ui-avatars.com/api/?name=${username}&background=2563eb&color=fff`
                    }
                    alt=""
                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                  />
                )}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Typing */}
        <div
          className="h-7 flex items-center px-6 gap-1.5 text-xs italic"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          {typingUser && (
            <>
              {typingUser}
              {[0, 150, 300].map((d, i) => (
                <span
                  key={i}
                  className="inline-block w-1 h-1 rounded-full animate-bounce"
                  style={{
                    background: "rgba(255,255,255,0.4)",
                    animationDelay: `${d}ms`,
                  }}
                />
              ))}
            </>
          )}
        </div>

        {/* Input bar */}
        <div className="glass mx-4 mt-3 rounded-2xl px-5 py-4 flex items-center gap-4">
          {/* Upload button */}
          <label
            className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-lg cursor-pointer transition-all duration-200 hover:scale-105"
            style={{
              background: image
                ? "rgba(255,255,255,0.14)"
                : "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {image ? "📎" : "🖼️"}
            <input
              type="file"
              className="hidden"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>

          {/* Message input */}
          <input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (typingRef.current) clearTimeout(typingRef.current);
              typingRef.current = setTimeout(
                () =>
                  socket.emit("typing", {
                    room,
                    username,
                    avatar,
                  }),
                400,
              );
            }}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${room}`}
            className="flex-1 px-5 py-3 rounded-full text-sm font-medium outline-none"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white",
            }}
          />

          {/* Send button */}
          <button
            onClick={sendMessage}
            className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-base font-bold transition-all duration-200 hover:-translate-y-0.5 hover:scale-105"
            style={{
              cursor: "pointer",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              boxShadow: "0 4px 16px rgba(255,255,255,0.08)",
            }}
          >
            ➤
          </button>
        </div>
      </div>
      {/* FRIENDS PANEL */}
      <div
        style={{
          width: "260px",
          minWidth: "260px",
          borderLeft: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(25px)",
          WebkitBackdropFilter: "blur(25px)",
          display: "flex",
          flexDirection: "column",
          padding: "16px",
          gap: 12,
          ...(isMobile
            ? {
                position: "fixed",
                top: 0,
                right: 0,
                height: "100%",
                zIndex: 40,
                transform: friendsOpen ? "translateX(0)" : "translateX(100%)",
                transition: "transform 0.25s ease",
              }
            : {
                position: "relative",
                flexShrink: 0,
              }),
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
            marginBottom: 10,
          }}
        >
          <span>Friends List</span>
          {isMobile && (
            <button
              onClick={() => setFriendsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.5)",
                fontSize: 18,
                cursor: "pointer",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Friends List */}
        {friends?.length > 0 ? (
          friends.map((f, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px",
                borderRadius: 12,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {/* Avatar */}
              <img
                src={
                  f.avatar ||
                  `https://ui-avatars.com/api/?name=${f.username}&background=222&color=fff`
                }
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />

              {/* Info */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
                  {f.username}
                </span>

                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                  {f.status || "Online"}
                </span>
              </div>
              <div
                style={{
                  marginTop: "auto",
                  paddingTop: 10,
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                }}
              ></div>
            </div>
          ))
        ) : (
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
            No friends yet
          </div>
        )}
        <div
          style={{
            marginTop: "10px",
            paddingTop: "10px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <button
            onClick={() => setPage("friendRequests")}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255,255,255,0.1)";
              e.target.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255,255,255,0.05)";
              e.target.style.color = "rgba(255,255,255,0.7)";
            }}
          >
            Friend Requests
          </button>
        </div>
      </div>
      {showProfile && selectedUser && (
        <ProfilePopover
          user={selectedUser}
          onClose={() => setShowProfile(false)}
          setPage={setPage}
        />
      )}
    </div>
  );
}

export default Chat;
