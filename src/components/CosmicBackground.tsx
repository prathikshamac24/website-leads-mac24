"use client";

import React, { useEffect, useState } from "react";

export function CosmicBackground({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const [starsShadow, setStarsShadow] = useState("");
  const [stars2Shadow, setStars2Shadow] = useState("");
  const [stars3Shadow, setStars3Shadow] = useState("");

  useEffect(() => {
    const generateStars = (count: number) => {
      const shadows = [];
      for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * 2000);
        const y = Math.floor(Math.random() * 2000);
        shadows.push(`${x}px ${y}px #FFF`);
      }
      return shadows.join(", ");
    };

    setStarsShadow(generateStars(700));
    setStars2Shadow(generateStars(200));
    setStars3Shadow(generateStars(100));
  }, []);

  return (
    <div className={`cosmic-parallax-container ${className}`}>
      <div id="stars" style={{ boxShadow: starsShadow }} className="cosmic-stars" />
      <div id="stars2" style={{ boxShadow: stars2Shadow }} className="cosmic-stars-medium" />
      <div id="stars3" style={{ boxShadow: stars3Shadow }} className="cosmic-stars-large" />
      
      <div id="horizon" className="cosmic-horizon">
        <div className="glow" />
      </div>
      <div id="earth" className="cosmic-earth" />

      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
