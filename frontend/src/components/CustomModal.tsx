import React from "react";

type ModalType = "success" | "error" | "warning" | "info";

interface CustomModalProps {
  isOpen: boolean;
  title: string;
  message: string | { message: string } | null;
  onClose: () => void;
  type?: ModalType;
}

const COLOR: Record<ModalType, string> = {
  success: "#2ecc71",
  error:   "#e74c3c",
  warning: "#f39c12",
  info:    "#3498db",
};

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  title,
  message,
  onClose,
  type = "info",
}) => {
  if (!isOpen) return null;

  const color = COLOR[type];

  const resolvedMessage =
    message && typeof message === "object" && "message" in message
      ? message.message
      : (message as string) ?? "Something went wrong";

  const renderIcon = () => {
    if (type === "success") {
      return (
        <div style={iconContainerStyle}>
          <div style={{ ...circleStyle, borderColor: color }}>
            <svg width="50" height="50" viewBox="0 0 50 50" style={iconStyle}>
              <path
                d="M 10 25 L 20 35 L 40 15"
                stroke={color}
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={checkPathStyle}
              />
            </svg>
          </div>
        </div>
      );
    }
    if (type === "error") {
      return (
        <div style={iconContainerStyle}>
          <div style={{ ...circleStyle, borderColor: color }}>
            <svg width="50" height="50" viewBox="0 0 50 50" style={iconStyle}>
              <path
                d="M 15 15 L 35 35 M 35 15 L 15 35"
                stroke={color}
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                style={crossPathStyle}
              />
            </svg>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {renderIcon()}
        <h3 style={{ ...titleStyle, color }}>{title}</h3>
        <p style={messageStyle}>{resolvedMessage}</p>
        <button style={{ ...buttonStyle, backgroundColor: color }} onClick={onClose}>
          OK
        </button>
      </div>

      <style>{`
        @keyframes pulseCircle {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes drawCheck {
          0%   { stroke-dashoffset: 50; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes drawCross {
          0%   { stroke-dashoffset: 60; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};

export default CustomModal;

// ── Styles ─────────────────────────────────────────────────────────────────────

const overlayStyle: React.CSSProperties = {
  position:        "fixed",
  top:             0,
  left:            0,
  width:           "100vw",
  height:          "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display:         "flex",
  justifyContent:  "center",
  alignItems:      "center",
  zIndex:          999,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding:         "20px 25px",
  borderRadius:    "10px",
  boxShadow:       "0 4px 12px rgba(0,0,0,0.2)",
  width:           "90%",
  maxWidth:        "450px",
  minHeight:       "300px",
  display:         "flex",
  flexDirection:   "column",
  justifyContent:  "center",
  alignItems:      "center",
  textAlign:       "center",
};

const iconContainerStyle: React.CSSProperties = { marginBottom: "20px" };

const circleStyle: React.CSSProperties = {
  width:          "80px",
  height:         "80px",
  borderRadius:   "50%",
  border:         "4px solid",
  display:        "flex",
  justifyContent: "center",
  alignItems:     "center",
  animation:      "pulseCircle 2s ease-in-out infinite",
};

const iconStyle: React.CSSProperties = { display: "block" };

const checkPathStyle: React.CSSProperties = {
  strokeDasharray:  50,
  strokeDashoffset: 0,
  animation:        "drawCheck 0.6s ease-in-out forwards",
};

const crossPathStyle: React.CSSProperties = {
  strokeDasharray:  60,
  strokeDashoffset: 0,
  animation:        "drawCross 0.5s ease-in-out forwards",
};

const titleStyle: React.CSSProperties = {
  fontSize:     "1.2rem",
  margin:       "0 0 10px 0",
};

const messageStyle: React.CSSProperties = {
  fontSize:     "0.95rem",
  marginBottom: "20px",
  color:        "#333",
};

const buttonStyle: React.CSSProperties = {
  color:        "#fff",
  border:       "none",
  padding:      "8px 16px",
  borderRadius: "5px",
  cursor:       "pointer",
  fontWeight:   "600",
  width:        "100%",
};
