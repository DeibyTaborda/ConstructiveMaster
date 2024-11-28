import React, { useState, useEffect } from 'react';
import usePostRequest from '../../services/usePostRequest';
import '../../assets/styles/subirImagen.css';

const SubirImagenes = ({ hayNuevaImagen }) => {
  const [imagenes, setImagenes] = useState({ imagen: '' });
  const [mensajeError, setMensajeError] = useState('');
  const [mensajeExito, setMensajeExito] = useState(''); 
  const { loading, response, error, postRequest } = usePostRequest('http://localhost:3001/subir/imagen');

  const manejarCambioArchivos = (e) => {
    const { name, files } = e.target;
    setImagenes({ ...imagenes, [name]: files[0] });
  };

  const manejarSubida = async () => {
    if (!imagenes || !imagenes.imagen) {
      setMensajeError('Por favor, selecciona una imagen');
  
      setTimeout(() => setMensajeError(''), 3000);
      return;
    }
    
    const formData = new FormData();
    formData.append('imagen', imagenes.imagen);
    const res = await postRequest(formData);
    setImagenes({imagen: ''})
    hayNuevaImagen();
  };

  useEffect(() => {
    if (error) {
      setMensajeError(error);

      setTimeout(() => setMensajeError(''), 3000);
    }
  }, [error]);

  return (
    <>
        <h2 className='titulo-imagenes-perfil-profesional'>Imágenes</h2>
        <div className="subir-imagenes-container">
        <div className="response-message">
            {mensajeExito && <p className="success-message">{mensajeExito}</p>}
            {mensajeError && <p className="error-message">{mensajeError}</p>}
        </div>
        <div className="upload-form">
            <input
            type="file"
            name="imagen"
            onChange={manejarCambioArchivos}
            className="file-input"
            />
            <button onClick={manejarSubida} className="upload-button">
            Subir Imágenes
            </button>
        </div>
        </div>
    </>
  );
};

export default SubirImagenes;
