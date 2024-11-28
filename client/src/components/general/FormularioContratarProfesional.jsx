import React, { useContext, useEffect, useState } from "react";
import '../../assets/styles/formularioContratar.css'; 
import { esFechaValida, esHoraValida } from '../../utils/utils';
import CartaProfesionalCuadrada2 from "./CartaProfesionalCuadrada2";
import { ProfesionalesContext } from "../../context/ProfesionalesContext";
import CartaEspecialidad from "./CartaEspecialidad";

function FormContratarProfesional({ solicitudPOST, seleccionarItem, cancel, datosItemSeleccionado, excluidoId, solicitudPOST2, IdprofesionalProporcionado, buscarNuevoProfesional}) {
    const {profesionales} = useContext(ProfesionalesContext);

    // Función para obtener los datos del profesional seleccionado en el LocalStorage 
    const obtenerDatosProfesionalAContratar = () => {
        const idProfesionalAContratar = localStorage.getItem('profesionalAContratar');
        if (idProfesionalAContratar) {
            const datosProfesional = JSON.parse(idProfesionalAContratar);
            return datosProfesional;
        }
    }

    const [item, setItem] = useState(null);
    const [errores, setErrores] = useState({});
    const [data, setData] = useState({
        id_profesional: obtenerDatosProfesionalAContratar()?.id || '',
        especialidad: '',
        fecha: '',
        hora: '',
        direccion: '',
        descripcion: '',
        excluidoId: excluidoId
    });

    const extraerDatosContextoProfesional = () => {
        const profesional = profesionales.find(profesional => profesional.id === data.id_profesional);
        return profesional;
    }
    
    // Función para actualizar el valor del item seleccionado
    const actualizarDatos = (item, datosItemSeleccionado) => {
        if (item === 'profesional') {
            setData(prevData => ({
                ...prevData,
                id_profesional: datosItemSeleccionado?.id || '',
                especialidad: '' 
            }));
        } else if (item === 'especialidad') {
            setData(prevData => ({
                ...prevData,
                especialidad: datosItemSeleccionado?.id || '',
                id_profesional: '' 
            }));
        }
    }

    useEffect(() => {
        setData({...data, excluidoId: excluidoId});
    }, [excluidoId]);

    // Efecto para cuando buscarNuevoProfesional sea true o data cambie se realice una solicitud con el fin de que el sistema busque un profesional
    useEffect(() => {
        if (buscarNuevoProfesional) {
            solicitudPOST(data);
            cancel();
        }
    }, [data, buscarNuevoProfesional]);

    useEffect(() => {
        if (IdprofesionalProporcionado) {
            solicitudPOST2({...data,id_profesional: IdprofesionalProporcionado });
        }
    }, [IdprofesionalProporcionado]);

    useEffect(() => {
        actualizarDatos(item, datosItemSeleccionado);
    }, [datosItemSeleccionado, item]);

    useEffect(() => {
        return () => {
            localStorage.removeItem('profesionalAContratar');
        }
    }, [])

    const validacion = (data) => {
        const erroresCampos = {};
        if (!data.especialidad && !data.id_profesional) {
            erroresCampos.general = 'Debes seleccionar al menos una opción entre Especialidad o Profesional';
        }

        if (!data.fecha) {
            erroresCampos.fecha = 'La fecha es requerida';
        } else if (!esFechaValida(new Date(data.fecha))) {
            erroresCampos.fecha = 'El formato de fecha no es válido';
        }

        if (!data.hora) {
            erroresCampos.hora = 'La hora es requerida';
        } else if (!esHoraValida(data.hora)) {
            erroresCampos.hora = 'El formato de la hora no es válido';
        }

        if (!data.direccion) {
            erroresCampos.direccion = 'La dirección es requerida';
        }

        return erroresCampos;
    }

    const eliminarError = (name, errores) => {
        const keys = Object.keys(errores);
        if (keys.includes(name)) {
            return setErrores({...errores, [name] : ''});
        }
    }

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        eliminarError(name, errores);
    
        const lengthLimits = {
            descripcion: 300,
            direccion: 60,
        };
    
        if (name === 'item') {
            seleccionarItem(value);
            setItem(value);
        } else if (lengthLimits[name] && value.length > lengthLimits[name]) {
            return;
        }
    
        setData(prevData => ({ ...prevData, [name]: value }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const existeErrores = validacion(data);
    
        if (Object.keys(existeErrores).length > 0) {
            setErrores(existeErrores);
            return;
        }

        if (!data.id_profesional) {      
            solicitudPOST(data);
        } else if (data.id_profesional) {
            solicitudPOST2(data);
            setData({
                id_profesional: '',
                especialidad: '',
                fecha: '',
                hora: '',
                direccion: '',
                descripcion: '',
                excluidoId: excluidoId
            });
        }

    }

    return (
        <>
            <form className="formulario-contratar" onSubmit={handleSubmit}>
                <h3 className="titulo-formulario">Agregar trabajo</h3>

                <label htmlFor="item">Elegir:</label>
                <select name="item" id="item" className="select-item-formulario-contratar" onChange={handleOnChange}>
                    <option value="">Seleccionar</option>
                    <option value="especialidad">Especialidad</option>
                    <option value="profesional">Profesional</option>
                </select>

                {item === 'profesional' && (                 
                    <div className="contenedor-carta2-profesional">
                        <CartaProfesionalCuadrada2
                            profesional={extraerDatosContextoProfesional()}
                        />
                    </div>
                )}
                {item === 'especialidad' && (
                    <div className="contenedor-carta-especialidad-formulario-contratar">
                        <CartaEspecialidad
                            especialidad={datosItemSeleccionado}
                        />
                    </div>
                )}
                {localStorage.getItem('profesionalAContratar')  !== null && !item && (
                    <div className="contenedor-carta2-profesional">
                        <CartaProfesionalCuadrada2
                            profesional={obtenerDatosProfesionalAContratar()}
                        />
                    </div>
                )}

                <label htmlFor="fecha" className="etiqueta-formulario">Fecha:</label>
                <input
                    type="date"
                    name="fecha"
                    className="campo-formulario"
                    onChange={handleOnChange}
                    value={data.fecha}
                />
                {errores.fecha && <p className="error-formulario">{errores.fecha}</p>}

                <label htmlFor="hora" className="etiqueta-formulario">Hora:</label>
                <input
                    type="time"
                    name="hora"
                    className="campo-formulario"
                    onChange={handleOnChange}
                    value={data.hora}
                />
                {errores.hora && <p className="error-formulario">{errores.hora}</p>}

                <label htmlFor="direccion" className="etiqueta-formulario">Dirección:</label>
                <input
                    type="text"
                    name="direccion"
                    className="campo-formulario"
                    onChange={handleOnChange}
                    value={data.direccion}
                />
                {errores.direccion && <p className="error-formulario">{errores.direccion}</p>}

                <label htmlFor="descripcion" className="etiqueta-formulario">Descripción:</label>
                <textarea
                    name="descripcion"
                    onChange={handleOnChange}
                    value={data.descripcion || ''}
                    className="campo-formulario-texto"
                />

                {errores.general && <p className="error-formulario">{errores.general}</p>}

                <div className="contenedor-botones-formulario">
                    <input
                        type="submit"
                        className="boton-formulario"
                        value={'Añadir'}
                    />
                </div>
            </form>
        </>
    );
}

export default FormContratarProfesional;
