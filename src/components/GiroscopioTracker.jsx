import React, { useState, useEffect } from 'react';

const GiroscopioTracker= () => {
    const [gyroscopeData, setGyroscopeData] = useState({
      alpha: null,
      beta: null,
      gamma: null,
    });
  
    useEffect(() => {
      const handleOrientation = (event) => {
        setGyroscopeData({
          alpha: event.alpha,
          beta: event.beta,
          gamma: event.gamma,
        });
      };
  
      window.addEventListener('deviceorientation', handleOrientation);
  
      return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    }, []);
  
    return (
      <div>
        <h3 className='text-xl font-bold'>Giroscopio</h3>
        <p>Alpha (Rotación en Z): {gyroscopeData.alpha}</p>
        <p>Beta (Rotación en X): {gyroscopeData.beta}</p>
        <p>Gamma (Rotación en Y): {gyroscopeData.gamma}</p>
      </div>
    );
  };

export default GiroscopioTracker
