import React, { useEffect, useState } from "react";
import '../../assets/styles/forms.css';

function FormEditarTrabajo({datos, solicitudPUT, onClick}) {
    const [errores, setErrores] = useState();
     const [data, setData] = useState({
        id_profesional: datos?.id_profesional || '',
        fecha: datos?.fecha || '',
        hora: datos?.hora || '',
        direccion: datos?.direccion || '',
        valor: datos?.valor || '',
        descripcion: datos?.descripcion || '',
    });

    useEffect(() => {
        if (datos) {
            setData({
                id_profesional: datos?.id_profesional || '',
                fecha: datos?.fecha || '',
                hora: datos?.hora || '',
                direccion: datos?.direccion || '',
                valor: datos?.valor || '',
                descripcion: datos?.descripcion || '',
            });
        }
    }, [datos]);

    const validacion = (data, datos) => {
        const formData = {};
        if (data.id_profesional) {
            if (data.id_profesional !== datos.id_profesional) formData.id_profesional = data.id_profesional;
        }
        if (data.fecha) {
            if (data.fecha !== datos.fecha) formData.fecha = data.fecha;
        }
        if (data.hora) {
            if (data.hora !== datos.hora) formData.hora = data.hora;
        }
        if (data.direccion) {
            if (data.direccion !== datos.direccion) formData.direccion = data.direccion;
        }
        if (data.valor) {
            if (data.valor !== datos.valor) formData.valor = data.valor;
        }
        if (data.descripcion) {
            if (data.descripcion !== datos.descripcion) formData.descripcion = data.descripcion;
        }
        console.log(formData);
        return formData;
    }


    const handleOnchange = (e) => {
        const {name, value} = e.target;
        setData({...data, [name] : value});
    }

    const handleSubmit = (e) => {
        setErrores('');
        e.preventDefault();
        const formData = validacion(data, datos);
        if (Object.values(formData).length === 0) {
            return setErrores('No hay campos por modificar');
        }
        solicitudPUT(formData);
    }


    return(
        <>
            <form className="form" onSubmit={handleSubmit}>
                <h3 className="titulo-form-editar-cliente">Editar</h3>
                <h4 className="nombre-cliente-editar">{datos?.nombre}</h4>
                <label htmlFor="id_profesional" className="label-form">Profesional:</label>
                <input 
                    type="number" 
                    name="id_profesional" 
                    className="input-form "
                    onChange={handleOnchange}
                    value={data.id_profesional}
                />
                <label htmlFor="fecha" className="label-form">Fecha:</label>
                <input 
                    type="date" 
                    name="fecha"
                    className="input-form "
                    onChange={handleOnchange}
                />
                {errores && errores.correo && (
                    <p>{errores.correo}</p>
                )}
                <label htmlFor="hora" className="label-form">Hora:</label>
                <input 
                    type="time" 
                    name="hora"
                    className="input-form "
                    onChange={handleOnchange}
                    value={data.hora}
                />
                <label htmlFor="direccion" className="label-form">Dirección:</label>
                <input 
                    type="text" 
                    name="direccion"
                    className="input-form "
                    onChange={handleOnchange}
                    value={data.direccion}
                />
                <label htmlFor="valor" className="label-form">Valor:</label>
                <input 
                    type="number" 
                    name="valor"
                    className="input-form "
                    value={data.valor}
                    onChange={handleOnchange}
                />
                <label htmlFor="descripcion" className="label-form">Descripción:</label>
                <textarea name="descripcion">
                    Descripción...
                </textarea>
                
                <div className="contenedor-botones-form-editar-cliente">
                    <input 
                        type="submit" 
                        className="boton-form-agregar-cliente" 
                        value={'Añadir'}
                    />
                    <button className="boton-cancelar-agregar-cliente" onClick={onClick}>Cancelar</button>
                </div>
                <p>{errores}</p>
            </form>
        </>
    ); 
}

export default FormEditarTrabajo;