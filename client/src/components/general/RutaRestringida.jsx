import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/rutaRestringida.css';

const RutaRestringida = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="no-access-container">
      <div className="no-access-content">
        <h1 className="no-access-title">¡Acceso Denegado!</h1>
        <p className="no-access-message">
          No tienes los permisos necesarios para acceder a esta página.
        </p>
        <div className="no-access-buttons">
          <button className="btn" onClick={handleGoBack}>
            Volver a Inicio
          </button>
          <button className="btn btn-secondary" onClick={() => alert('Contacta al administrador para obtener más información.')}>
            Solicitar ayuda
          </button>
        </div>
      </div>
    </div>
  );
};

export default RutaRestringida;
