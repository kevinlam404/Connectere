import { useEffect } from "react";
import axios from "axios";

function ProfilePopover({ user, onClose, setPage }) {
  useEffect(() => {
    const handleClick = (e) => {
      if (e.target.id === "overlay") onClose();
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [onClose]);

  return (
    <div
      id="overlay"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: 340,
          padding: "28px 24px",
          borderRadius: 28,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          color: "white",
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: -80,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.14), transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />

        {/* Avatar */}
        <img
          src={
            user.avatar ||
            `https://ui-avatars.com/api/?name=${user.username}&background=111827&color=fff`
          }
          alt=""
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid rgba(255,255,255,0.2)",
            boxShadow: "0 0 30px rgba(255,255,255,0.12)",
            zIndex: 2,
          }}
        />

        {/* Username */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            zIndex: 2,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
              color: "rgba(255,255,255,0.92)",
            }}
          >
            {user.username}
          </h2>

          <span
            style={{
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            Connectere User
          </span>
        </div>

        {/* Bio Card */}
        <div
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: 18,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            zIndex: 2,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              marginBottom: 8,
            }}
          >
            Bio
          </p>

          <p
            style={{
              margin: 0,
              fontSize: 14,
              lineHeight: 1.5,
              color: "rgba(255,255,255,0.75)",
            }}
          >
            {user.bio || "No bio yet"}
          </p>
        </div>

        {/* Status Card */}
        <div
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: 18,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            zIndex: 2,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
              marginBottom: 8,
            }}
          >
            Status
          </p>

          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: "rgba(255,255,255,0.8)",
            }}
          >
            {user.status || "Offline"}
          </p>
        </div>

        {/*Add Friend Button */}
        <button
          onClick={async () => {
            try {
              if (!user?._id) {
                console.log("No user id found:", user);
                return;
              }

              await axios.post(
                `http://localhost:5000/api/friends/request/${user._id}`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                },
              );

              alert("Friend request sent!");
            } catch (err) {
              console.log(err.response?.data || err.message);
            }
          }}
          style={{
            marginTop: 12,
            padding: "10px 14px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "white",
            cursor: "pointer",
          }}
        >
          Add Friend
        </button>
      </div>
    </div>
  );
}

export default ProfilePopover;
