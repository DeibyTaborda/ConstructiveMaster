import React, { useState, useEffect } from 'react';
import '../../assets/styles/camposPersonalizados.css';
import useAxios from '../../services/api';
import { usePutRequest } from '../../services/usePutRequest.js';
import { useAccionExitosa } from '../../hooks/useAccionExitosa.js';
import MensajeExitoso from '../general/MensajeExitoso2.jsx';
import SubirImagenes from './SubirImagenes.jsx';
import MostrarImagenes from './MostrarImagenes.jsx';

const CamposPersonalizados = ({ profesionalId }) => {
  const [campos, setCampos] = useState([]);
  const [nuevoCampo, setNuevoCampo] = useState({ key: '', value: '' });
  const [error, setError] = useState('');
  const {realizarAccion, accionRealizada} = useAccionExitosa(3000);
  const [descripcion, setDescripcion] = useState({descripcion: ''});
  const [ExisteNuevaImagen, setExisteNuevaImagen] = useState(false);
  const [mensajeActulazacionDescripcion, setMensajeActualizarDescripcion] = useState('');

  const {loading, error: errorCamposPersonalizados, response, data, fetchData} = useAxios(`http://localhost:3001/${profesionalId}/campos_personalizados`);
  const {loading: loadingDescripcion, error: errorDescripcion, response: responseDescripcion, data: dataDescripcion, fetchData: fetchDataDescripcion} = useAxios(`http://localhost:3001/descripcion/profesional`);
  const {loading: loadingCamposPersonalizados, error: errorActualizarCampos, response: responseActualizarCampos, sendPutRequest} = usePutRequest();
  const { loading: loadingActualizarDescripcion, error: errorActualizarDescripcion, response: responseActualizarDescripcion, sendPutRequest: sendActualizarDescripcionRequest } = usePutRequest();


  useEffect(() => {
    if (data) {
        setCampos(data);
    }
  }, [data]);

  useEffect(() => {
    if (dataDescripcion) {
      const descripcion = dataDescripcion.descripcion
      setDescripcion({descripcion: descripcion});
    }
  }, [dataDescripcion]);

  useEffect(() => {
    if (responseActualizarCampos) {
        realizarAccion();
    }
  }, [responseActualizarCampos]);

  const agregarCampo = () => {
    if (campos.length >= 10) {
      setError('Solo se pueden añadir hasta 10 campos.');
      return;
    }

    if (!nuevoCampo.key || !nuevoCampo.value) {
      setError('Ambos campos son obligatorios.');
      return;
    }

    setCampos([...campos, nuevoCampo]);
    setNuevoCampo({ key: '', value: '' });
    setError('');
  };

  const editarCampo = (index, newKey, newValue) => {
    const nuevosCampos = campos.map((campo, i) => i === index ? { key: newKey, value: newValue } : campo);
    setCampos(nuevosCampos);
  };

  const handleOnchange = (e) => {
    const {name, value} = e.target;
    if (value.length > 400) {
      return;
    }
    setDescripcion({descripcion: value});
  }

  const eliminarCampo = (index) => {
    const nuevosCampos = campos.filter((_, i) => i !== index);
    setCampos(nuevosCampos);
  };

  const guardarCambios = () => {
    sendPutRequest(`http://localhost:3001/${profesionalId}/campos_personalizados`, campos);
  };

  const guardarDescripcion = () => {
    sendActualizarDescripcionRequest(`http://localhost:3001/descripcion/profesional`, descripcion);
    setMensajeActualizarDescripcion('Se actulizó la descripción del perfil');

    setTimeout(() => {
      setMensajeActualizarDescripcion('');
    }, 2000);
  }

  const dispararAccion = () => {
    setExisteNuevaImagen(true);

    setTimeout(() => {
      setExisteNuevaImagen(false);
    }, 1);
  }

  return (
    <>
      <div className="campos-personalizados-container">
      <h3 className="titulo">Campos Personalizados</h3>
      {error && <div className="error-mensaje">{error}</div>}
      
      <ul className="campos-lista">
        {campos.map((campo, index) => (
          <li key={index} className="campo-item">
            <input
              type="text"
              className="campo-input-campo-especializado"
              value={campo.key}
              onChange={(e) => editarCampo(index, e.target.value, campo.value)}
              placeholder="Clave"
            />
            <input
              type="text"
              className="campo-input-campo-especializado"
              value={campo.value}
              onChange={(e) => editarCampo(index, campo.key, e.target.value)}
              placeholder="Valor"
            />
            <button className="boton eliminar-boton" onClick={() => eliminarCampo(index)}>Eliminar</button>
          </li>
        ))}
      </ul>

      {campos.length < 10 && (
        <div className="nuevo-campo">
          <input
            type="text"
            className="campo-input-campo-especializado"
            value={nuevoCampo.key}
            onChange={(e) => setNuevoCampo({ ...nuevoCampo, key: e.target.value })}
            placeholder="Nueva clave"
          />
          <input
            type="text"
            className="campo-input-campo-especializado"
            value={nuevoCampo.value}
            onChange={(e) => setNuevoCampo({ ...nuevoCampo, value: e.target.value })}
            placeholder="Nuevo valor"
          />
          <button className="boton agregar-boton" onClick={agregarCampo}>Añadir campo</button>
        </div>
      )}
      {accionRealizada &&( <MensajeExitoso mensaje={responseActualizarCampos} visible={accionRealizada}/>)}
      <button className="boton guardar-boton" onClick={guardarCambios}>Guardar cambios</button>
    </div>
    <div className="contenedor-descripcion">
      <label htmlFor="descripcion">Descripción</label>
      <p>{mensajeActulazacionDescripcion ? mensajeActulazacionDescripcion : ''}</p>
      <textarea name="descripcion" id="descripcion" placeholder='Ingresa una descripción' value={descripcion.descripcion} onChange={handleOnchange}></textarea>
      <button onClick={guardarDescripcion}>Agregar descripción</button>
    </div>

    <div>
      <SubirImagenes hayNuevaImagen={dispararAccion}/>
      <MostrarImagenes ExisteImagenNueva={ExisteNuevaImagen}/>
    </div>

    </>
  );
};

export default CamposPersonalizados;
