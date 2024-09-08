import React, { useEffect, useState } from "react";
import useAxios from "../../services/api";
import '../../assets/styles/forms.css';
import {validarNumerosYSimbolos, validarLongitudTexto, validarCorreo} from '../../utils/utils';

function FormEditarProfesional({onClickEditar, onClickCancelar, datosProfesional}) {
    const [datos, setDatos] = useState({ categories: [], subcategories: [] });
    const {loading, error, response, data, fetchData} = useAxios('http://localhost:3001/categorias');
    const [errores, setErrores] = useState(false);

    const [datosEnviar, setDatosEnviar] = useState({
        nombre: datosProfesional?.nombre || '',
        apellido: datosProfesional?.apellido || '',
        especialidad: datosProfesional?.especialidad || '',
        correo: datosProfesional?.correo || '',
        telefono: datosProfesional?.telefono || '',
        curriculum: datosProfesional?.curriculum || '',
        imagen: datosProfesional?.imagen || ''
    })

    const verificarDiferencia = (datosEnviar, datosProfesional) => {
        const data = {};
        if (datosEnviar.nombre !== datosProfesional.nombre) data.nombre = datosEnviar.nombre;
        if (datosEnviar.apellido !== datosProfesional.apellido) data.apellido = datosEnviar.apellido;
        if (datosEnviar.especialidad !== datosProfesional.especialidad)  data.especialidad = datosEnviar.especialidad;
        if (datosEnviar.correo !== datosProfesional.correo) data.correo = datosEnviar.correo;
        if (datosEnviar.telefono !== datosProfesional.telefono)  data.telefono = datosEnviar.correo; 
        if (datosEnviar.curriculum !== datosProfesional.curriculum) data.curriculum = datosEnviar.curriculum;
        if (datosEnviar.imagen !== datosProfesional.imagen) data.imagen = datosEnviar.imagen;
        return data;
    }

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Verifica los campos que han cambiado
        const diferenciaDatos = verificarDiferencia(datosEnviar, datosProfesional);
        
        // Si no hay cambios, puedes detener el proceso
        if (Object.keys(diferenciaDatos).length === 0) {
            onClickCancelar();
            return;
        }
    
        // Crea el objeto FormData solo con los datos que cambiaron
        const formData = new FormData();
        Object.entries(diferenciaDatos).forEach(([key, value]) => {
            formData.append(key, value);
        });
    
        // Envía los datos modificados
        await onClickEditar(formData);
    };
    
    
    useEffect(() => {
        if (data) {
          setDatos(data);
        }
      }, [data]);

    return(
        <form onSubmit={handleSubmit} className="form">
        <h3 className="titulo-form">Editar profesional</h3>
        <label htmlFor="nombre" className="label-form">Nombre:</label>
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
        {/* {errores.sin_cambios ? (<p>{errores.sin_cambios}</p>) : ''} */}
    </form>
    );
}

export default FormEditarProfesional;