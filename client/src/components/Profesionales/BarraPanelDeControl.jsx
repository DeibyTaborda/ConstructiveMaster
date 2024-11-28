import React, { useState } from 'react';
import '../../assets/styles/barraPanelDeControl.css';
import { useNavigate } from 'react-router-dom';

function BarraPanelDeControl({ setActiveSection }) {
  const [activeItem, setActiveItem] = useState('trabajos-pendientes');
  const navigate = useNavigate();

  const handleItemClick = (section) => {
    setActiveSection(section);
    setActiveItem(section);
  };

  const cerrarSesion = () => {
    localStorage.clear();
    navigate('/');
  }

  return (
    <div className="barra-panel-control-profesional">
      <h2>Panel de Control</h2>
      <ul>
        <li 
          className={activeItem === 'trabajos-pendientes' ? 'active' : ''} 
          onClick={() => handleItemClick('trabajos-pendientes')}
        >
          Trabajos confirmados
        </li>
        <li 
          className={activeItem === 'confirmar-trabajos' ? 'active' : ''} 
          onClick={() => handleItemClick('confirmar-trabajos')}
        >
          Confirmar trabajos
        </li>
        <li 
          className={activeItem === 'todos-los-trabajos' ? 'active' : ''} 
          onClick={() => handleItemClick('todos-los-trabajos')}
        >
          Todos los trabajos
        </li>
        <li 
          className={activeItem === 'realizar-pagos' ? 'active' : ''} 
          onClick={() => handleItemClick('realizar-pagos')}
        >
          Realizar pagos
        </li>
        <li 
          className={activeItem === 'actividad' ? 'active' : ''} 
          onClick={() => handleItemClick('actividad')}
        >
          Actividad
        </li>
        <li 
          className={activeItem === 'datos-personales' ? 'active' : ''} 
          onClick={() => handleItemClick('datos-personales')}
        >
          Datos Personales
        </li>
        <li 
          className={activeItem === 'datos-perfil' ? 'active' : ''} 
          onClick={() => handleItemClick('datos-perfil')}
        >
          Datos perfil
        </li>
        <li 
          className={activeItem === 'cambiar-contrasena' ? 'active' : ''} 
          onClick={() => handleItemClick('cambiar-contrasena')}
        >
          Cambiar contraseña
        </li>
        <li 
          className={activeItem === 'notificaciones' ? 'active' : ''} 
          onClick={cerrarSesion}
        >
          Cerrar sesión
        </li>
      </ul>
    </div>
  );
}

export default BarraPanelDeControl;
