import React, { useEffect, useState } from "react";
import '../../assets/styles/formAgregarProfesional.css';
import useAxios from "../../services/api";
import {validarNumerosYSimbolos, validarLongitudTexto, validarCorreo} from '../../utils/utils';

function FormEditarProfesional({onClickEditar}) {
    const [datos, setDatos] = useState({ categories: [], subcategories: [] });
    const {loading, error, response, data, fetchData} = useAxios('http://localhost:3001/categorias');
    const [errores, setErrores] = useState(false);

    const [datosEnviar, setDatosEnviar] = useState({
        nombre: '',
        apellido: '',
        especialidad: '',
        correo: '',
        telefono: '',
        curriculum: null,
        imagen: null
    })

    useEffect(() => {
        if (datosEnviar) {
            console.log(datosEnviar);
        }
    }, [datosEnviar]);

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

    const handleFileOnchange = (e) => {
        const {name, files} = e.target;
        setDatosEnviar({...datosEnviar, [name] : files[0]});
    }

    const validacion = () => {
        const erroresValidacion = {};
        
        const validadoCorreo = datosEnviar.correo ? validarCorreo(datosEnviar.correo) : null;
        if (validadoCorreo) erroresValidacion.formatoCorreo = validadoCorreo;

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
            await onClickEditar(formData);
        } else {
            // Establecer los errores si hay alguno
            setErrores(erroresValidacion);
        }
    };
    
    

    useEffect(() => {
        if (data) {
          setDatos(data);
        }
      }, [data]);

    return(
        <form onSubmit={handleSubmit} className="form-agregar-profesional">
        <label htmlFor="nombre">Nombre:</label>
        <input 
            type="text"
            name="nombre"
            className="input-agegar-cliente"
            value={datosEnviar.nombre}
            onChange={handleOnchange}
        />
        <label htmlFor="apellido">Apellido:</label>
        <input 
            type="text" 
            name="apellido"
            className="input-agegar-cliente"
            value={datosEnviar.apellido}
            onChange={handleOnchange}
        />
        {data && (
            <>
                <label htmlFor="especialidad">Especialidad</label>
                <select name="especialidad" onChange={handleOnchange}>
                    <option value="seleccionar">Seleccionar</option>
                    {datos.subcategories && datos.subcategories.map((subcategoria) => (
                         <option value={subcategoria.id}>{subcategoria.subcategoria}</option>
                    ))}
                </select>
            </>
        )}
        <label htmlFor="correo">Correo:</label>
        <input 
            type="email" 
            name="correo"
            value={datosEnviar.correo}
            onChange={handleOnchange}
        />
        <label htmlFor="telefono">Teléfono:</label>
        <input 
            type="number" 
            name="telefono"
            value={datosEnviar.telefono}
            onChange={handleOnchange}
        />
        <label htmlFor="curriculum">Hoja de vida:</label>
        <input 
            type="file"
            name="curriculum"
            onChange={handleFileOnchange}
            accept=".pdf, .doc, .docx"
            />
        <label htmlFor="imagen">Imagen:</label>
        <input 
            type="file" 
            name="imagen"
            onChange={handleFileOnchange}
            accept=".jpg, .png, jpeg"
        />
        {errores && typeof errores === 'string' ? (
            <p>{errores}</p>
        ) : (
            errores && Object.values(errores).map((error, index) => (
                <p key={index}>{error}</p>
            ))
        )}
        <input type="submit" />
    </form>
    );
}

export default FormEditarProfesional;