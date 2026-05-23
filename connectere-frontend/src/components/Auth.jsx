import { useState, useEffect } from "react";
import axios from "axios";
import { APP_NAME, APP_MOTTO } from "../config/appConfig";
import AnimatedLogo from "../components/AnimatedLogo";

function Auth({ setUser }) {
  const [islogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //Connectere branding in the browser tab
  useEffect(() => {
    document.title = `${APP_NAME} - ${APP_MOTTO}`;
  }, []);

  //Handle login and registration
  const handleAuth = async () => {
    try {
      const endpoint = islogin ? "login" : "register";
      const res = await axios.post(
        `http://localhost:5000/api/auth/${endpoint}`,
        { username, password },
      );

      if (islogin) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
      } else {
        alert("Registered! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAuth();
    }
  };

  //UI
  return (  
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0a0a0a",
        fontFamily: "system-ui, sans-serif",
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
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.07), transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "5%",
          left: "15%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08), transparent 65%)",
          filter: "blur(35px)",
          pointerEvents: "none",
        }}
      />

      {/* Card */}
      <div
        style={{
          width: 360,
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
          gap: 14,
          color: "white",
          position: "relative",
          zIndex: 10,
        }}
      >
        <AnimatedLogo />
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          <h1>{APP_NAME} - {APP_MOTTO}</h1>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "rgba(255,255,255,0.88)",
              letterSpacing: "0.01em",
              margin: 0,
            }}
          >
            {islogin ? "Welcome back"  : "Create account"}
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.35)",
              marginTop: 6,
            }}
          >
            {islogin ? "Sign in to continue" : "Fill in your details below"}
          </p>
        </div>

        {/* Username */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            Username
          </label>
          <input
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              padding: "11px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.06)",
              color: "white",
              outline: "none",
              fontSize: 14,
              fontFamily: "inherit",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "rgba(255,255,255,0.3)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "rgba(255,255,255,0.1)")
            }
          />
        </div>

        {/* Password */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              padding: "11px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.06)",
              color: "white",
              outline: "none",
              fontSize: 14,
              fontFamily: "inherit",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = "rgba(255,255,255,0.3)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "rgba(255,255,255,0.1)")
            }
          />
        </div>

        {/* Button */}
        <button
          onClick={handleAuth}
          style={{
            marginTop: 4,
            padding: "12px 0",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.9)",
            cursor: "pointer",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "inherit",
            letterSpacing: "0.02em",
            boxShadow: "0 4px 16px rgba(255,255,255,0.06)",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255,255,255,0.18)";
            e.target.style.borderColor = "rgba(255,255,255,0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255,255,255,0.12)";
            e.target.style.borderColor = "rgba(255,255,255,0.2)";
          }}
        >
          {islogin ? "Sign in" : "Register"}
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }}
          />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
            or
          </span>
          <div
            style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }}
          />
        </div>

        {/* Switch */}
        <p
          onClick={() => setIsLogin(!islogin)}
          style={{
            textAlign: "center",
            fontSize: 13,
            color: "rgba(255,255,255,0.4)",
            cursor: "pointer",
            transition: "color 0.15s",
            margin: 0,
          }}
          onMouseEnter={(e) =>
            (e.target.style.color = "rgba(255,255,255,0.75)")
          }
          onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.4)")}
        >
          {islogin
            ? "Don't have an account? Register"
            : "Already have an account? Sign in"}
        </p>
      </div>
    </div>
  );
}

export default Auth;
