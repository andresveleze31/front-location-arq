import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const LocationHttp = () => {
  const [location, setLocation] = useState(null);
  const [latency, setLatency] = useState(null);
  const [latencies, setLatencies] = useState([]); // Guardar las latencias
  const requestCountRef = useRef(0); // Usar una referencia para contar las peticiones

  useEffect(() => {
    const fetchLocationData = async () => {
      if (requestCountRef.current < 100) {
        const startTime = Date.now();

        try {
          const response = await axios.get('http://localhost:3000/location-http');
          const latencyTime = Date.now() - startTime; // Calculamos la latencia

          // Guardamos la latencia
          setLatencies((prevLatencies) => [...prevLatencies, latencyTime]);
          setLocation(response.data);
          setLatency(latencyTime);

          // Incrementamos el contador de peticiones usando la referencia
          requestCountRef.current += 1;

          // Volver a hacer la solicitud cuando se reciba la respuesta
          setTimeout(fetchLocationData, 0); // Sin retraso, iniciamos la siguiente petición inmediatamente
        } catch (error) {
          console.error('Error al obtener los datos de ubicación:', error);
        }
      }
    };

    // Iniciar el ciclo automáticamente al montar el componente
    fetchLocationData();

    // Limpiar recursos si el componente se desmonta
    return () => {
      requestCountRef.current = 0;
      setLatencies([]);
      setLocation(null);
      setLatency(null);
    };
  }, []);

  const averageLatency = latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0;

  return (
    <div>
      <h1>Ubicación en tiempo real</h1>
      {location ? (
        <p>
          Latitud: {location.latitude}, Longitud: {location.longitude}
        </p>
      ) : (
        <p>Cargando ubicación...</p>
      )}
      {latency !== null && <p>Latencia: {latency} ms</p>}
      <h3>Latencias por petición: {latencies.join(', ')}</h3>
      <h3>Latencia promedio: {averageLatency} ms</h3>
    </div>
  );
};

export default LocationHttp;
