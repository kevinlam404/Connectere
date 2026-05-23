function MessageList({ messages, user }) {
    return (
        <div style={styles.container}>
      {messages.map((msg, i) => (
        <div
          key={i}
          style={{
            ...styles.message,
            alignSelf:
              msg.username === user
                ? "flex-end"
                : "flex-start",
            background:
              msg.username === user
                ? "#3b82f6"
                : "#374151",
          }}
        >
          <div style={styles.username}>
            {msg.username}
          </div>

          <div>{msg.text}</div>

          {msg.image && (
            <img
              src={msg.image}
              style={styles.image}
            />
          )}

          <div style={styles.time}>
            {msg.time}
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 15,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    overflowY: "auto",
  },

  message: {
    padding: 10,
    borderRadius: 10,
    maxWidth: "60%",
    color: "white",
  },

  username: {
    fontSize: 12,
    opacity: 0.7,
  },

  time: {
    fontSize: 10,
    opacity: 0.6,
  },

  image: {
    width: 200,
    marginTop: 5,
    borderRadius: 8,
  },
};

export default MessageList;