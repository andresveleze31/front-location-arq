import React, { useState, useEffect } from 'react';

const AcelerometroTracker = () => {
  const [accelerometerData, setAccelerometerData] = useState({
    x: null,
    y: null,
    z: null,
  });

  useEffect(() => {
    const handleMotion = (event) => {
      setAccelerometerData({
        x: event.acceleration.x,
        y: event.acceleration.y,
        z: event.acceleration.z,
      });
      console.log(accelerometerData);
    };

    window.addEventListener('devicemotion', handleMotion);

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, []);

  return (
    <div>
      <h3 className='text-xl font-bold'>Acelerómetro</h3>
      <p>X: {accelerometerData.x}</p>
      <p>Y: {accelerometerData.y}</p>
      <p>Z: {accelerometerData.z}</p>
    </div>
  );
};

export default AcelerometroTracker;
