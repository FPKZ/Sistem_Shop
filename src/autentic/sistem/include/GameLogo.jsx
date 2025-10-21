import React from 'react';

export default function GameLogo() {
  return (
    <div className="game-logo-container">
      {/* Main Logo */}
      <div className="logo-wrapper">
        {/* Glow effect background */}
        <h1 className="logo-glow">
          ROMA 
        </h1>
        
        {/* Main text */}
        <h1 className="logo-text">
          ROMA 
        </h1>
        
        {/* Underline accent */}
        <div className="logo-underline"></div>
      </div>
      
      {/* Subtitle */}
      <p className="logo-subtitle">
        Sexy Shop
      </p>
      
      {/* Decorative elements */}
      <div className="logo-decorative">
        <div className="ping-dot ping-1"></div>
        <div className="ping-dot ping-2"></div>
        <div className="ping-dot ping-3"></div>
      </div>
    </div>
  );
}
