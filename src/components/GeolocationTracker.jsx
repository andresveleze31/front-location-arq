import React, { useState, useEffect } from 'react';

const GeolocationTracker = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (err) => {
          setError(err.message);
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      setError('Geolocalización no soportada en este navegador');
    }
  }, []);

  return (
    <div>
      <h3 className='text-xl font-bold'>Ubicación GPS</h3>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <p>Latitud: {location.latitude}</p>
          <p>Longitud: {location.longitude}</p>
        </>
      )}
    </div>
  );
};

export default GeolocationTracker;
