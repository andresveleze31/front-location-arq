import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Location = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [latency, setLatency] = useState(null); // Latencia actual
  const [latencies, setLatencies] = useState([]); // Arreglo para almacenar todas las latencias
  const [isRunning, setIsRunning] = useState(true); // Estado para controlar si el ciclo está en ejecución
  const [maxMemoryUsed, setMaxMemoryUsed] = useState(0); // Memoria máxima usada

  useEffect(() => {
    const socket = io("http://localhost:3000");

    const getRandomLocation = (lat, lon) => {
      const latVariation = (Math.random() - 0.5) * 0.001;
      const lonVariation = (Math.random() - 0.5) * 0.001;
      return {
        latitude: lat + latVariation,
        longitude: lon + lonVariation,
      };
    };

    const sendLocationData = (latitude, longitude) => {
      const startTime = Date.now();

      const locationData = getRandomLocation(latitude, longitude);

      socket.emit("sendLocation", locationData);

      socket.once("locationUpdate", (data) => {
        const latencyTime = Date.now() - startTime;
        console.log("Datos recibidos del servidor:", data);
        setLocation(data);
        setLatency(latencyTime);
        setLatencies((prevLatencies) => [...prevLatencies, latencyTime]);

        // Medir memoria usada
        if (window.performance && window.performance.memory) {
          const usedMemory = window.performance.memory.usedJSHeapSize / 1024 / 1024; // Convertir a MB
          setMaxMemoryUsed((prevMax) => Math.max(prevMax, usedMemory)); // Guardar la mayor memoria usada
        }

        if (isRunning) {
          sendLocationData(data.latitude, data.longitude);
        }
      });
    };

    if (isRunning) {
      sendLocationData(40.7128, -74.006);
    }

    return () => {
      socket.off("locationUpdate");
      socket.disconnect();
    };
  }, [isRunning]);

  const stopCycle = () => {
    setIsRunning(false);
  };

  const getAverageLatency = () => {
    if (latencies.length === 0) return 0;
    const totalLatency = latencies.reduce((sum, latency) => sum + latency, 0);
    return totalLatency / latencies.length;
  };

  return (
    <div>
      <h1>Ubicación en tiempo real</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {location ? (
        <p>
          Latitud: {location.latitude}, Longitud: {location.longitude}
        </p>
      ) : (
        <p>Cargando ubicación...</p>
      )}
      {latency !== null && <p>Latencia actual: {latency} ms</p>}
      <button onClick={stopCycle} disabled={!isRunning}>
        Detener ciclo
      </button>

      {!isRunning && (
        <div>
          <h3>Latencias registradas:</h3>
          <ul>
            {latencies.map((latency, index) => (
              <li key={index}>{latency} ms</li>
            ))}
          </ul>
          <p>Latencia promedio: {getAverageLatency().toFixed(2)} ms</p>
          <p>Máxima memoria usada: {maxMemoryUsed.toFixed(2)} MB</p>
        </div>
      )}
    </div>
  );
};

export default Location;
