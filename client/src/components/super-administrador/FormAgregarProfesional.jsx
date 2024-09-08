import React, { useEffect, useState } from "react";
import '../../assets/styles/forms.css';
import useAxios from "../../services/api";
import {validarNumerosYSimbolos, validarLongitudTexto, validarCorreo} from '../../utils/utils';

function FormAgregarProfesional({onClickCrear, onClickCancelar}) {
    const [datos, setDatos] = useState({ categories: [], subcategories: [] });

    // Hook para realizar una solicitud GET para obtener las subcategorias 
    const {loading, error, response, data, fetchData} = useAxios('http://localhost:3001/categorias');

    // Estado de manejador de errores
    const [errores, setErrores] = useState(false);

    // Estado de los campos del formulario
    const [datosEnviar, setDatosEnviar] = useState({
        nombre: '',
        apellido: '',
        especialidad: '',
        correo: '',
        telefono: '',
        curriculum: null,
        imagen: null
    })

    // Manejador de eventos de los campos del formulario
    const handleOnchange = (e) => {
        const {name, value} = e.target;
        if (['nombre', 'apellido'].includes(name)) {
            if (validarNumerosYSimbolos(value)) return;
            if (validarLongitudTexto(value, 30)) return;
        } else if (name === 'telefono') {
            if (validarLongitudTexto(value, 10)) return;
        }
        setDatosEnviar({...datosEnviar, [name] : value});
    }

    // Manejador de eventos de los input tipo file
    const handleFileOnchange = (e) => {
        const {name, files} = e.target;
        setDatosEnviar({...datosEnviar, [name] : files[0]});
    }

    // Función para validar la existencia de los datos
    const validacion = () => {
        const erroresValidacion = {};
        if (!datosEnviar.nombre) erroresValidacion.nombre = 'El nombre es obligatorio.';
        if (!datosEnviar.apellido) erroresValidacion.apellido = 'El apellido es obligatorio.';
        if (!datosEnviar.especialidad) erroresValidacion.especialidad = 'Selecciona una especialidad.';
        if (!datosEnviar.correo) erroresValidacion.correo = 'El correo es obligatorio.';
        if (!datosEnviar.telefono) erroresValidacion.telefono = 'El teléfono es obligatorio.';
        if (!datosEnviar.curriculum) erroresValidacion.curriculum = 'Adjunta tu hoja de vida.';        

        const validadoCorreo = validarCorreo(datosEnviar.correo);
        if (!validadoCorreo) erroresValidacion.formatoCorreo = validadoCorreo;

        setErrores(erroresValidacion);
        return erroresValidacion;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Ejecutar la validación y obtener el resultado
        const erroresValidacion = validacion(); 
        
        // Si no hay errores, continuar con la solicitud POST
        if (Object.keys(erroresValidacion).length === 0) {
            const formData = new FormData();
            formData.append('nombre', datosEnviar.nombre);
            formData.append('apellido', datosEnviar.apellido);
            formData.append('especialidad', datosEnviar.especialidad);
            formData.append('correo', datosEnviar.correo);
            formData.append('telefono', datosEnviar.telefono);
            formData.append('curriculum', datosEnviar.curriculum);
            formData.append('imagen', datosEnviar.imagen);
            
            // Llamar a la función para enviar los datos
            await onClickCrear(formData);
        } else {
            // Establecer los errores si hay alguno
            setErrores(erroresValidacion);
        }
    };

    // Función para almacenar la data en un estado del componente
    useEffect(() => {
        if (data) {
          setDatos(data);
        }
      }, [data]);

    return(
        <form onSubmit={handleSubmit} className="form">
            <h3 className="titulo-form">Agregar profesional</h3>
        <label htmlFor="nombre" className="label-form ">Nombre:</label>
        <input 
            type="text"
            name="nombre"
            className="input-form"
            value={datosEnviar.nombre}
            onChange={handleOnchange}
        />
        {errores.nombre ? (<p className="mensaje-error-campo">{errores.nombre}</p>) : ''}

        <label htmlFor="apellido" className="label-form">Apellido:</label>
        <input 
            type="text" 
            name="apellido"
            className="input-form"
            value={datosEnviar.apellido}
            onChange={handleOnchange}
        />
        {errores.apellido ? (<p className="mensaje-error-campo">{errores.apellido}</p>) : ''}

        {data && (
            <>
                <label htmlFor="especialidad" className="label-form">Especialidad</label>
                <select name="especialidad" onChange={handleOnchange}>
                    <option value="seleccionar">Seleccionar</option>
                    {datos.subcategories && datos.subcategories.map((subcategoria) => (
                         <option value={subcategoria.id}>{subcategoria.subcategoria}</option>
                    ))}
                </select>
                {errores.especialidad ? (<p className="mensaje-error-campo">{errores.especialidad}</p>) : ''}
            </>
        )}

        <label htmlFor="correo" className="label-form">Correo:</label>
        <input 
            type="email" 
            name="correo"
            value={datosEnviar.correo}
            onChange={handleOnchange}
            className="input-form"
        />
        {errores.correo ? (<p className="mensaje-error-campo">{errores.correo}</p>) : ''}

        <label htmlFor="telefono" className="label-form">Teléfono:</label>
        <input 
            type="number" 
            name="telefono"
            value={datosEnviar.telefono}
            onChange={handleOnchange}
            className="input-form"
        />
        {errores.telefono ? (<p className="mensaje-error-campo">{errores.telefono}</p>) : ''}

        <label htmlFor="curriculum" className="label-form">Hoja de vida:</label>
        <input 
            type="file"
            name="curriculum"
            onChange={handleFileOnchange}
            accept=".pdf, .doc, .docx"
            className="input-form-file"
        />
        {errores.curriculum ? (<p className="mensaje-error-campo">{errores.curriculum}</p>) : ''}

        <label htmlFor="imagen" className="label-form">Imagen:</label>
        <input 
            type="file" 
            name="imagen"
            onChange={handleFileOnchange}
            accept=".jpg, .png, jpeg"
            className="input-form-file"
        />
        {errores.imagen ? (<p className="mensaje-error-campo">{errores.imagen}</p>) : ''}
        <div className="contenedor-botones-form">
            <input type="submit" className="input-submit"/>
            <button className="input-cancelar" onClick={onClickCancelar}>Cancelar</button>
        </div>
    </form>
    );
}

export default FormAgregarProfesional;