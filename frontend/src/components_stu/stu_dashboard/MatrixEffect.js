import React, { useEffect, useRef } from 'react';
import './MatrixEffect.css';

const MatrixEffect = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = 300; // Match the height with your grid
    
    // Characters - taken from the original Matrix.
    const matrix = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    
    // Set the font
    ctx.font = `${fontSize}px monospace`;
    
    // Drops - one per column
    const drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100; // Start drops at random positions above the viewport
    }
    
    // Drawing the characters
    function draw() {
      // Semi-transparent black rectangle to create trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set the color and font of the characters
      ctx.fillStyle = 'rgba(91, 156, 255, 0.5)'; // Light blue color to match theme
      
      // Loop over drops
      for (let i = 0; i < drops.length; i++) {
        // Pick a random character
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        
        // Draw the character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // Reset drop to top when it reaches the bottom
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Move the drop down
        drops[i]++;
      }
    }
    
    // Animation loop
    const interval = setInterval(draw, 33); // ~30fps
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="matrix-canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '300px',
        zIndex: -1,
        opacity: 0.7, // Very subtle
        pointerEvents: 'none'
      }}
    />
  );
};

export default MatrixEffect;
