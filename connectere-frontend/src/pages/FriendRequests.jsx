import { useEffect, useState } from "react";
import axios from "axios";

function FriendRequests({ setPage }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await axios.get(
        "http://localhost:5000/api/friends/requests",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setRequests(res.data || []);
    };

    load();
  }, []);

  const accept = async (id) => {
    await axios.post(
      `http://localhost:5000/api/friends/accept/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setRequests((prev) => prev.filter((u) => u._id !== id));
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "#0a0a0a",
        color: "white",
        padding: 30,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Friend Requests</h2>

        <button
          onClick={() => setPage("chat")}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Back
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        {requests.length === 0 && <p>No requests</p>}

        {requests.map((u) => (
          <div
            key={u._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 12,
              marginBottom: 10,
              borderRadius: 10,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <span>{u.username}</span>

            <button
              onClick={() => accept(u._id)}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                background: "rgba(0,255,150,0.2)",
                border: "1px solid rgba(0,255,150,0.4)",
                color: "white",
                cursor: "pointer",
              }}
            >
              Accept
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FriendRequests;