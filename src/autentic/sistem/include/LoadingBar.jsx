import React, { useState, useEffect } from 'react';

export default function LoadingBar({ duration = 4000, onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (duration / 50));
        if (newProgress >= 100) {
          clearInterval(interval);
          if (onComplete) {
            setTimeout(onComplete, 500);
          }
          return 100;
        }
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="loading-bar-container">
      <div className="loading-bar-track">
        {/* Background glow */}
        <div className="loading-bar-bg-glow"></div>
        
        {/* Progress bar */}
        <div
          className="loading-bar-progress"
          style={{ width: `${progress}%` }}
        >
          {/* Glowing effect */}
          <div className="loading-bar-glow"></div>
          
          {/* Moving shimmer */}
          <div className="loading-bar-shimmer"></div>
        </div>
      </div>
      
      {/* Progress text */}
      <div className="loading-bar-info">
        <span className="loading-bar-label">Loading...</span>
        <span className="loading-bar-percentage">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
