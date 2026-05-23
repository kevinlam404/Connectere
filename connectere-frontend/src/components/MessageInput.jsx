import { useState, useRef } from "react";
import axios from "axios";
import socket from "../socket";

function MessageInput({ room, user, setMessages }) {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const typingTimeout = useRef(null);
  
  //Send Message
  const sendMessage = async () => {
    if (!message.trim() && !image) return;

    let imageUrl = "";

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
      username: user,
      text: message,
      image: imageUrl,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_msg", msgData);

    setMessage("");
    setImage(null);
  };

  return (
    <div style={styles.inputBox}>
      <input
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);

          if (!user) return;

          socket.emit("typing", { room, username: user });

          clearTimeout(typingTimeout.current);

          typingTimeout.current = setTimeout(() => {
            socket.emit("stop_typing", { room, username: user });
          }, 800);
        }}
        placeholder="Type message..."
        style={styles.input}
      />

      <input type="file" onChange={(e) => setImage(e.target.files[0])} />

      <button onClick={sendMessage} style={styles.button}>
        Send
      </button>
    </div>
  );
}

const styles = {
  inputBox: {
    display: "flex",
    gap: 10,
    padding: 10,
    background: "#1f2937",
  },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "none",
  },

  button: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "none",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer",
  },
};

export default MessageInput;
