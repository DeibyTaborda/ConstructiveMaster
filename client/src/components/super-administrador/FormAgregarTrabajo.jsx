import React, { useEffect, useState } from "react";
import '../../assets/styles/forms.css';
import {esFechaValida, esHoraValida} from '../../utils/utils';

function FormAgregarTrabajo({solicitudPOST, onClick}) {
    const [errores, setErrores] = useState({});
     const [data, setData] = useState({
        id_cliente: '',
        id_profesional: '',
        fecha: '',
        hora: '',
        direccion: '',
        valor: '',
        descripcion: ''
    });

    const validacion = (data) => {
                const erroresCampos = {};
        // Verifica si 'id_cliente' está presente y es un número válido
        if (data.id_cliente) {
            if (isNaN(data.id_cliente)) {
                erroresCampos.id_cliente = 'El id del cliente no puede tener letras';
            }
        } else {
            erroresCampos.id_cliente = 'El id del cliente es requerido';
        }

        // Verifica si 'id_profesional' está presente y es un número válido
        if (data.id_profesional) {
            if (isNaN(data.id_profesional)) {
                erroresCampos.id_profesional = 'El id del profesional no puede tener letras';
            }
        } else {
            erroresCampos.id_profesional = 'El id del profesional es requerido';
        }

        // Verifica si 'fecha' está presente y es una fecha válida
        if (data.fecha) {
            if (!esFechaValida(new Date(data.fecha))) {
                erroresCampos.fecha = 'El formato de fecha no es válido';
            }
        } else {
            erroresCampos.fecha = 'La fecha es requerida';
        }

        // Verifica si 'hora' está presente y es una hora válida
        if (data.hora) {
            if (!esHoraValida(data.hora)) {
                erroresCampos.hora = 'El formato de la hora no es válido';
            }
        } else {
            erroresCampos.hora = 'La hora es requerida';
        }

        // Verifica si 'valor' está presente y es un número válido
        if (data.valor) {
            if (isNaN(data.valor)) {
                erroresCampos.valor = 'El valor debe ser un valor numérico';
            }
        } else {
            erroresCampos.valor = 'El valor es requerido';
        }

        return erroresCampos;
    }

    const handleOnchange = (e) => {
        const {name, value} = e.target;
        console.log(value)
        setData({...data, [name] : value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const existeErrores = validacion(data);

        if (Object.values(existeErrores).length > 0) {
            return setErrores(existeErrores);
        }

        solicitudPOST(data);
    }


    return(
        <>
            <form className="form" onSubmit={handleSubmit}>
                <h3 className="titulo-form-editar-cliente">Editar</h3>
                <h4 className="nombre-cliente-editar">mi bro</h4>
                <label htmlFor="id_cliente" className="label-form">Cliente:</label>
                <input 
                    type="number" 
                    name="id_cliente" 
                    className="input-form "
                    onChange={handleOnchange}
                    value={data.id_cliente}
                />
                {errores ? (<p>{errores.id_cliente}</p>) : ''}

                <label htmlFor="id_profesional" className="label-form">Profesional:</label>
                <input 
                    type="number" 
                    name="id_profesional" 
                    className="input-form "
                    onChange={handleOnchange}
                    value={data.id_profesional}
                />
                {errores ? (<p>{errores.id_profesional}</p>) : ''}

                <label htmlFor="fecha" className="label-form">Fecha:</label>
                <input 
                    type="date" 
                    name="fecha"
                    className="input-form "
                    onChange={handleOnchange}
                />
                {errores ? (<p>{errores.fecha}</p>) : ''}

                <label htmlFor="hora" className="label-form">Hora:</label>
                <input 
                    type="time" 
                    name="hora"
                    className="input-form "
                    onChange={handleOnchange}
                    value={data.hora}
                />
                {errores ? (<p>{errores.hora}</p>) : ''}

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
                {errores ? (<p>{errores.valor}</p>) : ''}

                <label htmlFor="descripcion" className="label-form">Descripción:</label>
                <textarea name="descripcion" onChange={handleOnchange}>
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
            </form>
        </>
    ); 
}

export default FormAgregarTrabajo;