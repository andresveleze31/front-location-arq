import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const Location = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Establecer la conexión con el servidor
    const socket = io('http://localhost:3000');

    // Escuchar el evento 'locationUpdate' enviado desde el servidor
    socket.on('locationUpdate', (data) => {
      console.log('Datos recibidos del servidor:', data);
      setLocation(data); // Actualizar el estado con los datos recibidos
    });

    // Manejar errores de conexión
    socket.on('connect_error', (err) => {
      setError('Error de conexión con el servidor: ' + err.message);
    });

    // Limpiar la conexión cuando el componente se desmonte
    return () => {
      socket.off('locationUpdate');
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Ubicación en tiempo real</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {location ? (
        <p>
          Latitud: {location.latitude}, Longitud: {location.longitude}
        </p>
      ) : (
        <p>Cargando ubicación...</p>
      )}
    </div>
  );
};

export default Location;
