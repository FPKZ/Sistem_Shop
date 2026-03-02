import '../../../public/css/LoadingPage.css'
import React from 'react'
import GameLogo from './include/GameLogo'
import LoadingBar from './include/LoadingBar'

export default function LoadingPage() {
  return (
    <div className="loading-screen-container">
      {/* Background pattern */}
      <div className="background-glow"></div>
      
      {/* Animated grid background */}
      <div className="grid-background"></div>
      
      <div className="loading-content">
        {/* Game Logo */}
        <GameLogo />
        
        {/* Loading Bar */}
        {/* <LoadingBar 
          duration={5000}
          onComplete={() => {
            console.log('Loading complete!');
            // Here you would typically navigate to the main game
          }}
        /> */}
        
        {/* Additional loading text */}
        <div className="loading-footer">
          <p className="loading-text">
            Iniciando Aplicação...
          </p>
          <div className="loading-dots">
            <div className="dot dot-1"></div>
            <div className="dot dot-2"></div>
            <div className="dot dot-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
