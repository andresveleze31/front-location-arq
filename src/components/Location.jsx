import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const Location = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [latency, setLatency] = useState(null); // Latencia actual
  const [latencies, setLatencies] = useState([]); // Arreglo para almacenar todas las latencias
  const [intervalId, setIntervalId] = useState(null); // Para almacenar el ID del intervalo
  const [isRunning, setIsRunning] = useState(true); // Estado para controlar si el ciclo está en ejecución

  useEffect(() => {
    // Establecer la conexión con el servidor
    const socket = io('http://localhost:3000');

    // Función para generar una variación aleatoria en la ubicación
    const getRandomLocation = (lat, lon) => {
      const latVariation = (Math.random() - 0.5) * 0.001; // Variación aleatoria en latitud
      const lonVariation = (Math.random() - 0.5) * 0.001; // Variación aleatoria en longitud
      return {
        latitude: lat + latVariation,
        longitude: lon + lonVariation,
      };
    };

    // Función para enviar los datos de ubicación y calcular la latencia
    const sendLocationData = (latitude, longitude) => {
      const startTime = Date.now(); // Marca el tiempo antes de enviar los datos

      // Obtener los datos de ubicación con una pequeña variación
      const locationData = getRandomLocation(latitude, longitude);

      // Enviar los datos de ubicación al servidor
      socket.emit('sendLocation', locationData);

      // Escuchar el evento de respuesta del servidor
      socket.once('locationUpdate', (data) => {
        const latencyTime = Date.now() - startTime; // Calcula la latencia
        console.log('Datos recibidos del servidor:', data);
        setLocation(data); // Actualiza el estado con los datos recibidos
        setLatency(latencyTime); // Actualiza la latencia

        // Guardar la latencia en el arreglo
        setLatencies((prevLatencies) => [...prevLatencies, latencyTime]);

        // Reenviar los mismos datos después de recibir la respuesta para continuar el ciclo
        if (isRunning) {
          sendLocationData(data.latitude, data.longitude); // Pasar los datos recibidos para continuar el ciclo
        }
      });
    };

    // Iniciar el ciclo enviando los datos de ubicación con una ubicación inicial
    if (isRunning) {
      sendLocationData(40.7128, -74.0060); // Ubicación inicial en Nueva York
    }

    // Limpiar la conexión cuando el componente se desmonte
    return () => {
      socket.off('locationUpdate');
      socket.disconnect();
    };
  }, [isRunning]); // Volver a ejecutar cuando el estado isRunning cambie

  // Función para detener el ciclo
  const stopCycle = () => {
    setIsRunning(false);
  };

  // Calcular la latencia promedio
  const getAverageLatency = () => {
    if (latencies.length === 0) return 0;
    const totalLatency = latencies.reduce((sum, latency) => sum + latency, 0);
    return totalLatency / latencies.length;
  };

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
      {latency !== null && <p>Latencia actual: {latency} ms</p>} {/* Mostrar la latencia */}
      <button onClick={stopCycle} disabled={!isRunning}>
        Detener ciclo
      </button>

      {/* Mostrar la lista de latencias y la latencia promedio */}
      {!isRunning && (
        <div>
          <h3>Latencias registradas:</h3>
          <ul>
            {latencies.map((latency, index) => (
              <li key={index}>{latency} ms</li>
            ))}
          </ul>
          <p>Latencia promedio: {getAverageLatency()} ms</p>
        </div>
      )}
    </div>
  );
};

export default Location;
