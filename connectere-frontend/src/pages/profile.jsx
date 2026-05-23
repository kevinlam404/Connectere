import { useState, useEffect } from "react";
import axios from "axios";
import { APP_NAME, APP_MOTTO } from "../config/appConfig";

function Profile({ user, setUser, setPage }) {
  const [avatar, setAvatar] = useState(null);
  const [bio, setBio] = useState(user.bio || "");
  const [status, setStatus] = useState(user.status || "");

  useEffect(() => {
    document.title = `${APP_NAME} - ${APP_MOTTO}`;
  }, []);

  const saveProfile = async () => {
    try {
      let avatarUrl = user.avatar || "";

      if (avatar && typeof avatar !== "string") {
        const formData = new FormData();
        formData.append("image", avatar);
        const res = await axios.post(
          "http://localhost:5000/api/upload/image",
          formData,
        );
        avatarUrl = res.data.imageUrl;
      }

      const res = await axios.put(
        `http://localhost:5000/api/users/${user._id}`,
        { avatar: avatarUrl, bio, status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      const updatedUser = { ...user, avatar: avatarUrl, bio, status };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert("Profile updated!");
      setPage("chat");
    } catch (err) {
      console.log(err);
    }
  };

  const labelStyle = {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.3)",
  };

  const inputStyle = {
    padding: "11px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    outline: "none",
    fontSize: 14,
    fontFamily: "inherit",
    resize: "vertical",
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0a0a0a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Orbs */}
      <div
        style={{
          position: "fixed",
          top: "-180px",
          left: "-120px",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.18), rgba(180,180,180,0.06) 50%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-160px",
          right: "-100px",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 60% 60%, rgba(255,255,255,0.15), rgba(160,160,160,0.05) 50%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.07), transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      {/* Card */}
      <div
        style={{
          width: 400,
          padding: "36px 32px",
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow:
            "0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          color: "white",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "rgba(255,255,255,0.88)",
              margin: 0,
            }}
          >
            Edit Profile
          </h1>
          <button
            onClick={() => setPage("chat")}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.35)",
              cursor: "pointer",
              fontSize: 20,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Avatar preview */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <img
            src={
              avatar && typeof avatar !== "string"
                ? URL.createObjectURL(avatar)
                : user.avatar ||
                  `https://ui-avatars.com/api/?name=${user.username}&background=222&color=fff`
            }
            alt=""
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid rgba(255,255,255,0.15)",
              boxShadow: "0 0 24px rgba(255,255,255,0.08)",
            }}
          />
          <label
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              cursor: "pointer",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.6)",
              fontSize: 13,
              fontFamily: "inherit",
            }}
          >
            Change Avatar
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => setAvatar(e.target.files[0])}
            />
          </label>
        </div>

        {/* Username (read only) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            Username
          </label>
          <div
            style={{
              padding: "11px 14px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "rgba(255,255,255,0.4)",
              fontSize: 14,
            }}
          >
            {user.username}
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={saveProfile}
          style={{
            padding: "12px 0",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.9)",
            cursor: "pointer",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "inherit",
            boxShadow: "0 4px 16px rgba(255,255,255,0.06)",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255,255,255,0.18)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255,255,255,0.12)";
          }}
        >
          Save Changes
        </button>

        {/* Bio and Status */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={labelStyle}>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell something about yourself..."
            style={inputStyle}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={labelStyle}>Status</label>
          <input
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="What's your status?"
            style={inputStyle}
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;
