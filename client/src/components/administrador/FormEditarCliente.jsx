import React, { useEffect, useState } from "react";
import '../../assets/styles/formEditarCliente.css';
import {validarNumerosYSimbolos, validarLongitudTexto, validarCorreo2, primeraLetraMayuscula} from '../../utils/utils';

function FormEditarCliente({datos, solicitudPUT, onClick}) {
    const [errores, setErrores] = useState({});
     const [data, setData] = useState({
        nombre: datos?.nombre || '',
        correo: datos?.correo || '',
        telefono: datos?.telefono || '',
        direccion: datos?. direccion || '',
        imagen: datos?.imagen || ''
    });

    useEffect(() => {
        if (datos) {
            setData({
                nombre: datos?.nombre || '',
                correo: datos?.correo || '',
                telefono: datos?.telefono || '',
                direccion: datos?. direccion || '',
                imagen: datos?.imagen || '' 
            });
        }
    }, [datos]);


    const handleOnchange = (e) => {
        const {name, value} = e.target;

        if (name === 'nombre') {
            if (validarNumerosYSimbolos(value)) return;
            if (validarLongitudTexto(value, 30)) return;
            const primeraletra = primeraLetraMayuscula(value);
            return setData({...data, [name] : primeraletra});

        } 

        if (name === 'telefono') {
            if (value.length > 10) return;
        }

        if (name === 'correo') {
            if (validarLongitudTexto(value, 100)) return; 
        }

        if (name === 'direccion'){
            if (validarLongitudTexto(value, 30)) return;
        }

        setData({...data, [name] : value});
    }

    const handleFileOnchange = (e) => {
        const {name, files} = e.target;
        setData({...data, [name] : files[0]});
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(); 
        formData.append('nombre', data.nombre);
        formData.append('correo', data.correo);
        formData.append('telefono', data.telefono);
        formData.append('direccion', data.direccion);
        formData.append('imagen', data.imagen);

        solicitudPUT(formData);
    }


    return(
        <>
            <form className="form-editar-cliente" onSubmit={handleSubmit}>
                <h3 className="titulo-form-editar-cliente">Editar</h3>
                <h4 className="nombre-cliente-editar">{datos?.nombre}</h4>
                <label htmlFor="nombre" className="label-form">Nombre:</label>
                <input 
                    type="text" 
                    name="nombre" 
                    className="input-form "
                    onChange={handleOnchange}
                    value={data.nombre}
                />
                <label htmlFor="correo" className="label-form">Correo:</label>
                <input 
                    type="text" 
                    name="correo"
                    className="input-form "
                    onChange={handleOnchange}
                    value={data.correo}
                />
                {errores && errores.correo && (
                    <p>{errores.correo}</p>
                )}
                <label htmlFor="telefono" className="label-form">Teléfono:</label>
                <input 
                    type="number" 
                    name="telefono"
                    className="input-form "
                    onChange={handleOnchange}
                    value={data.telefono}
                />
                <label htmlFor="direccion" className="label-form">Dirección:</label>
                <input 
                    type="text" 
                    name="direccion"
                    className="input-form "
                    value={data.direccion}
                    onChange={handleOnchange}
                />
                <label htmlFor="imagen" className="label-form">Imagen:</label>
                <input 
                    type="file" 
                    name="imagen"
                    className="input-file-form-editar-cliente"
                    onChange={handleFileOnchange}
                />
                
                <div className="contenedor-botones-form-editar-cliente">
                    <input 
                        type="submit" 
                        className="boton-form-agregar-cliente" 
                        value={'Añadir'}
                    />
                    <button className="boton-cancelar-agregar-cliente" onClick={onClick}>Cancelar</button>
                </div>
            </form>
        </>
    ); 
}

export default FormEditarCliente;