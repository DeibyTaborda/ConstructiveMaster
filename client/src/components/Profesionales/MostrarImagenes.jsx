import React, { useState, useEffect } from 'react';
import useAxios from '../../services/api';
import useDelete from '../../services/delete';
import '../../assets/styles/mostrarImagenes.css';

const MostrarImagenes = ({ ExisteImagenNueva }) => {
  const [imagenes, setImagenes] = useState([]);
  const [idImagenEliminar, setIdImagenEliminar] = useState('');
  const { response, loading, error, data, fetchData } = useAxios('http://localhost:3001/subir/imagen');
  const { response: responseEliminar, error: errorEliminar, eliminar } = useDelete(`http://localhost:3001/subir/imagen/${idImagenEliminar}`);

  useEffect(() => {
    if (data) {
      setImagenes(data);
    }
  }, [data]);

  useEffect(() => {
    if (ExisteImagenNueva) {
      fetchData();
    }
  }, [ExisteImagenNueva, fetchData]);

  useEffect(() => {
    const eliminarYActualizar = async () => {
      if (idImagenEliminar) {
        await eliminar();
        fetchData();
        setIdImagenEliminar('');
      }
    };
    eliminarYActualizar();
  }, [idImagenEliminar, eliminar, fetchData]);

  return (
    <div className="container">
      {loading ? (
        <p className="loading">Cargando imágenes...</p>
      ) : error ? (
        <p className="error">Error al cargar imágenes: {error.message}</p>
      ) : (
        <>
          {imagenes.length > 0 ? (
            <div className="gallery">
              {imagenes.map((imagen) => (
                <div key={imagen.id} className="image-card">
                  <img src={`http://localhost:3001/${imagen.imagen}`} alt={`Imagen ${imagen.id}`} className="image" />
                  <button className="delete-button" onClick={() => setIdImagenEliminar(imagen.id)}>Eliminar</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-images">No hay imágenes subidas.</p>
          )}
        </>
      )}
    </div>
  );
};

export default MostrarImagenes;
