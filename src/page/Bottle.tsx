// src/components/InspirationNote.tsx
import React from "react";
import "./InspirationNote.css"; // 用于动画效果

const Bottle: React.FC = () => {
  const bottle = require("../asset/img/bottle.png");
  const paper = require("../asset/img/paper.png");

  return (
    <div>
      <div className="bottle">
        <img src={bottle} alt="bottle" />
      </div>
      <div className="inspiration-animation">
        {" "}
        <img src={paper} alt="paper" style={{ width: "100px" }} />
      </div>
    </div>
  );
};

export default Bottle;
