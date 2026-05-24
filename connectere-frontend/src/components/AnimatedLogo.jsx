import logo from "../assets/connectere logo.png";

function AnimatedLogo() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: 18,
      }}
    >
      <img
        src={logo}
        alt="Connectere Logo"
        style={{
          width: 80,
          height: 80,
          objectFit: "contain",
          animation: "float 3s ease-in-out infinite",
          filter: "drop-shadow(0 0 20px rgba(255,255,255,0.18))",
        }}
      />
    </div>
  );
}

export default AnimatedLogo;