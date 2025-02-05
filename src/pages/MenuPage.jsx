import React from "react";
import { Link } from "react-router-dom";

const MenuPage = () => {
  return (
    <div class="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-green-500 text-center">
        Arquitectura de Software - Menu Opciones Localizacion
      </h1>
      <div className="flex flex-col gap-4 mt-4 w-full justify-center items-center">
        <Link className="bg-green-200 font-bold px-5 py-3 rounded-xl" to={"/rest"}>
          Implementacion Rest
        </Link>
        <Link className="bg-green-200 font-bold px-5 py-3 rounded-xl" to={"/ws"}>
          Implementacion WS
        </Link>
        <Link className="bg-green-200 font-bold px-5 py-3 rounded-xl" to={"/http"}>
          Implementacion HTTP
        </Link>
      </div>
    </div>
  );
};

export default MenuPage;
