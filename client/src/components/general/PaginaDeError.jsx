import React from "react";
import '../../assets/styles/paginaError.css';
import { Link } from "react-router-dom";

function PaginaDeError({errorCode}) {
    let message;

    switch (errorCode) {
      case 500:
        message = "Ocurrió un error interno en el servidor. Por favor, inténtalo de nuevo más tarde.";
        break;
      case 404:
        message = "No se encontraron los datos solicitados.";
        break;
      case 400:
        message = "Solicitud incorrecta. Por favor, verifica los datos e inténtalo de nuevo.";
        break;
      case 401:
        message = "No tienes permiso para acceder a este recurso. Por favor, inicia sesión.";
        break;
      case 403:
        message = "Acceso denegado. No tienes permisos suficientes.";
        break;
      case 504:
        message = "La solicitud ha tardado demasiado. Intenta más tarde.";
        break;
      default:
        message = "Ocurrió un error. Por favor, inténtalo más tarde.";
    }
  
    return(
        <>
            <div className="error-page">
                <h1 className="error-title">{errorCode}</h1>
                    <p className="error-message">¡Oops! Página no encontrada.</p>
                    <p>
                        {message}
                    </p>
                <Link to="/" className="error-link">
                    Volver al Inicio
                </Link>
            </div>
        </>
    );
}

export default PaginaDeError;