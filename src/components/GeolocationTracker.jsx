import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const GeolocationTracker = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    // Función para obtener ubicación del navegador
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            const gpsData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };

            setLocation(gpsData);
            socket.emit("gpsData", gpsData); // Enviar al servidor
          },
          (error) => console.error("Error obteniendo ubicación:", error),
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        console.error("Geolocalización no soportada en este navegador");
      }
    };

    getLocation();

    // Escuchar eventos del servidor
    socket.on("locationUpdate", (gpsData) => {
      setLocation(gpsData);
    });

    return () => {
      socket.off("locationUpdate");
    };
  }, []);

  return (
    <div>
      <h3 className="text-xl font-bold">Ubicación GPS (Desde WebSockets)</h3>
      <p>Latitud: {location.latitude}</p>
      <p>Longitud: {location.longitude}</p>
    </div>
  );
};

export default GeolocationTracker;
