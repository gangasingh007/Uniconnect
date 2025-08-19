// components/Loader.jsx
import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const Loader = ({ message = "Loading" }) => {
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, rgba(0, 0, 0, 0.8) 70%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/30 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 20}%`,
            }}
          />
        ))}
      </div>

      <StyledWrapper>
        <div className="loader-container">
          <div className="loader">
            <span className="loader-text">{message}</span>
            <span className="load" />
          </div>
        </div>
      </StyledWrapper>
    </motion.div>
  );
};

const StyledWrapper = styled.div`
  .loader-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .loader {
    width: 100px;
    height: 60px;
    position: relative;
    margin-bottom: 2rem;
  }

  .loader-text {
    position: absolute;
    top: 0;
    padding: 0;
    margin: 0;
    color: #C8B6FF;
    animation: text_enhanced 3.5s ease both infinite;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: lowercase;
    background: linear-gradient(135deg, #C8B6FF, #9A79FF, #D1C2FF);
    background-size: 200% 200%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: text_enhanced 3.5s ease both infinite, gradient_shift 2s ease-in-out infinite;
  }

  .load {
    background: linear-gradient(135deg, #9A79FF, #C8B6FF);
    border-radius: 50px;
    display: block;
    height: 18px;
    width: 18px;
    bottom: 0;
    position: absolute;
    transform: translateX(82px);
    animation: loading_enhanced 3.5s ease both infinite;
    box-shadow: 
      0 0 20px rgba(154, 121, 255, 0.5),
      0 0 40px rgba(154, 121, 255, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  .load::before {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #D1C2FF, #E5D4FF);
    border-radius: inherit;
    animation: loading2_enhanced 3.5s ease both infinite;
    box-shadow: 0 0 15px rgba(209, 194, 255, 0.6);
  }

  .spinner-ring {
    position: absolute;
    width: 120px;
    height: 120px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.7;
  }

  .ring-segment {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 2px solid transparent;
    border-radius: 50%;
    border-top-color: rgba(154, 121, 255, 0.8);
    border-right-color: rgba(200, 182, 255, 0.4);
    animation: pulse_ring 2s ease-in-out infinite;
  }

  .ring-segment:nth-child(2) {
    width: 90%;
    height: 90%;
    top: 5%;
    left: 5%;
    border-top-color: rgba(209, 194, 255, 0.6);
    animation-delay: -0.7s;
  }

  .ring-segment:nth-child(3) {
    width: 80%;
    height: 80%;
    top: 10%;
    left: 10%;
    border-top-color: rgba(200, 182, 255, 0.4);
    animation-delay: -1.4s;
  }

  @keyframes gradient_shift {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  @keyframes pulse_ring {
    0%, 100% {
      opacity: 0.3;
      transform: scale(0.8);
    }
    50% {
      opacity: 0.8;
      transform: scale(1);
    }
  }

  @keyframes text_enhanced {
    0% {
      letter-spacing: 1px;
      transform: translateX(0px);
      filter: blur(0px);
    }
    40% {
      letter-spacing: 3px;
      transform: translateX(30px);
      filter: blur(0px);
    }
    80% {
      letter-spacing: 1px;
      transform: translateX(40px);
      filter: blur(0px);
    }
    90% {
      letter-spacing: 3px;
      transform: translateX(0px);
      filter: blur(1px);
    }
    100% {
      letter-spacing: 1px;
      transform: translateX(0px);
      filter: blur(0px);
    }
  }

  @keyframes loading_enhanced {
    0% {
      width: 18px;
      transform: translateX(0px);
      opacity: 1;
    }
    40% {
      width: 100%;
      transform: translateX(0px);
      opacity: 0.8;
    }
    80% {
      width: 18px;
      transform: translateX(82px);
      opacity: 1;
    }
    90% {
      width: 100%;
      transform: translateX(0px);
      opacity: 0.9;
    }
    100% {
      width: 18px;
      transform: translateX(0px);
      opacity: 1;
    }
  }

  @keyframes loading2_enhanced {
    0% {
      transform: translateX(0px);
      width: 18px;
      opacity: 0.8;
    }
    40% {
      transform: translateX(0%);
      width: 85%;
      opacity: 1;
    }
    80% {
      width: 100%;
      transform: translateX(0px);
      opacity: 0.9;
    }
    90% {
      width: 85%;
      transform: translateX(15px);
      opacity: 1;
    }
    100% {
      transform: translateX(0px);
      width: 18px;
      opacity: 0.8;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .loader-text,
    .load,
    .load::before,
    .ring-segment {
      animation-duration: 8s;
    }
  }

  /* Mobile optimizations */
  @media (max-width: 768px) {
    .loader {
      width: 80px;
      height: 50px;
    }
    
    .loader-text {
      font-size: 0.9rem;
    }
    
    .spinner-ring {
      width: 100px;
      height: 100px;
    }
  }
`;

export default Loader;
