import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const ComingSoon = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        padding: "1rem",
      }}
    >
      <img
        src="https://res.cloudinary.com/dczjloaiy/image/upload/v1750069904/job153-wit-55_lmmpca.jpg"
        alt="Coming soon"
        style={{
          width: "100%",
          maxWidth: 500,
          height: "auto",
          borderRadius: 16,
          boxShadow: "0 4px 24px #0001",
        }}
      />
      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: 32,
          padding: "12px 32px",
          background: "#b8b5ff",
          color: "#232946",
          border: "none",
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 18,
          cursor: "pointer",
          boxShadow: "0 2px 8px #b8b5ff44",
          transition: "background 0.2s, color 0.2s",
        }}
        className="back-btn"
      >
        ⬅ Back
      </button>
    </div>
  );
};

export default ComingSoon;
