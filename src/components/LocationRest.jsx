import React, { useEffect, useState } from 'react';

const LocationRest = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [latency, setLatency] = useState(null); // Latencia actual
  const [latencies, setLatencies] = useState([]); // Arreglo para almacenar todas las latencias
  const [requestCount, setRequestCount] = useState(0); // Contador de peticiones

  useEffect(() => {
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
    const sendLocationData = async (latitude, longitude) => {
      const startTime = Date.now(); // Marca el tiempo antes de enviar los datos

      // Obtener los datos de ubicación con una pequeña variación
      const locationData = getRandomLocation(latitude, longitude);

      try {
        // Enviar los datos de ubicación al servidor usando fetch (REST)
        const response = await fetch('http://localhost:3000/location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(locationData),
        });

        const data = await response.json();
        const latencyTime = Date.now() - startTime; // Calcula la latencia real
        console.log('Datos recibidos del servidor:', data);
        setLocation(data); // Actualiza el estado con los datos recibidos
        setLatency(latencyTime); // Actualiza la latencia

        // Guardar la latencia en el arreglo
        setLatencies((prevLatencies) => [...prevLatencies, latencyTime]);

        // Incrementar el contador de peticiones
        setRequestCount((prevCount) => prevCount + 1);
      } catch (error) {
        setError('Error al conectar con el servidor: ' + error.message);
      }
    };

    // Función para iniciar el ciclo de 100 peticiones
    const startCycle = async () => {
      let currentCount = 0;
      let latitude = 40.7128; // Latitud inicial
      let longitude = -74.0060; // Longitud inicial

      while (currentCount < 100) {
        await sendLocationData(latitude, longitude); // Enviar los datos y esperar la respuesta
        currentCount++;
        latitude += 0.0001; // Ajustar la latitud para la siguiente iteración (variación simulada)
        longitude += 0.0001; // Ajustar la longitud para la siguiente iteración (variación simulada)
      }
    };

    // Iniciar el ciclo solo si requestCount es 0 (no ha iniciado aún)
    if (requestCount === 0) {
      startCycle(); // Comienza el ciclo de 100 peticiones
    }

    // Limpiar el intervalo cuando el componente se desmonte
    return () => {};
  }, [requestCount]); // Reejecutar el efecto cuando el contador de peticiones cambie

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

      {/* Mostrar la lista de latencias y la latencia promedio */}
      <div>
        <h3>Latencias registradas:</h3>
        <ul>
          {latencies.map((latency, index) => (
            <li key={index}>{latency} ms</li>
          ))}
        </ul>
        <p>Latencia promedio: {getAverageLatency()} ms</p>
      </div>
    </div>
  );
};

export default LocationRest;
