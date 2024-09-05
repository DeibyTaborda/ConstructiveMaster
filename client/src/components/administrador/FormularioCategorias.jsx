import React, { useState, useEffect } from "react";
import '../../assets/styles/formularioCategorias.css';
import usePostRequest from "../../services/usePostRequest";
import {primeraLetraMayuscula} from '../../utils/utils';
import useAxios from "../../services/api";

function FormularioCategorias({ campos, title, id, onClick, foreingKeysCategoria}) {
    const [formData, setFormData] = useState({});
    const [errores, setErrores] = useState('');
    const [erroresImage, setErroresImage] = useState('');

    const {loading, error, response, postRequest} = usePostRequest('http://localhost:3001/categorias'); 
    
    useEffect(() => {
        if (response) {
            setErrores('');
            setErroresImage('');
            onClick();
        }
    }, [response]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const regex = /\d|\.|,|[^\w\sáéíóúÁÉÍÓÚüÜñÑ]/;

        if (['categoria', 'subcategoria'].includes(name) && regex.test(value)){
            setErrores('No se permiten números');
            return;
        } 

        if (value.length > 30 ) {
            setErrores('No se permiten más de 20 caracteres');
            return;
        }

        const letraMayuscula = primeraLetraMayuscula(value);

        setErrores('');
        
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: letraMayuscula
        }));
        console.log(formData)
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const regexImagen = /\.(jpg|jpeg|png|gif|bmp)$/i;

        const imagen = files[0].name;

        if (!regexImagen.test(imagen)) {
            setErroresImage('Archivo no permitido');
            return;
        }
        
        setErroresImage('');

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: files[0]
        }));

        console.log(formData)
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const data = new FormData();
    
        // Agrega los datos del formulario a FormData
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });
    
        await postRequest(data);
        setFormData({});
    }

    return (
        <form className="formulario-categoria" id={id} onSubmit={handleSubmit}>
            <h3 className="title-categorias">{title}</h3>
            {campos.map(({ label, name, tipo }, index) => (
                <>
                    <label htmlFor={name} className="label-categoria">{label + ':'}</label>
                    <input
                        type={tipo}
                        name={name}
                        className={`campo-categoria ${tipo === 'file' ? '' : 'normal'}`}
                        value={tipo !== 'file' ? formData[name] || '' : undefined}
                        onChange={tipo === 'file' ? handleFileChange : handleChange}
                    />
                     {name === 'categoria' || name === 'subcategoria' && errores ? <p className="error-form-category">{errores}</p> : <p className="error-form-category"></p> }
                     {name === 'imagenCategoria' || name === 'imagenSubcategoria' && erroresImage ? <p className="error-form-category">{erroresImage}</p> : <p className="error-form-category"></p> }
                </>
            ))}
            {foreingKeysCategoria && (
                <>
                    <label htmlFor="id_categoria" className="label-categoria">Categoría:</label>
                    <select autofocus  name="id_categoria" onChange={handleChange}>
                    <option value="seleccionar">Seleccionar</option>
                        {foreingKeysCategoria && foreingKeysCategoria.map((categoria) => (
                    <option value={categoria.id}>{categoria.categoria}</option>
                        ))}
                </select>
                </>
                    )}
            <input type="submit" className="boton-enviar-categoria"/>
            {error && <p className="error-category-exists">{error}</p>}
        </form>
    );
}

export default FormularioCategorias;

