import React, {useContext, useEffect, useState} from "react";
import SubcategoryContext from "../../context/SubcategoryContext";
import '../../assets/styles/formularioEditCategoria.css';
import ButtonEliminar from "./ButtonEliminar";
import { usePutRequest } from "../../services/usePutRequest.js";
import {primeraLetraMayuscula} from '../../utils/utils.js';

function FormEditarCategoria({onClick, onUpdate}) {
    const {selectedSubcategory, setSelectedSubcategory} = useContext(SubcategoryContext);
    const categoria = selectedSubcategory?.nameCategory || '';
    const tabla = selectedSubcategory?.tableId || '';
    const id = selectedSubcategory.categoryId;
    
    const [colorButton, setColorButton] = useState(null);

    const [ selectedCategoria, setSelectedCategoria ] = useState({
        categoria: categoria,
        imgCategoria: '',
        estado: 'Activa' // Valor por defecto del estado
    });

    const {loading, error, response, sendPutRequest} = usePutRequest();

    useEffect(() => {
        const result = cambioCategoria(selectedSubcategory, selectedCategoria);
        setColorButton(result);
    }, [selectedCategoria.categoria, selectedCategoria.imgCategoria, selectedCategoria.estado]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        
        // Convertir la primera letra en mayúscula si es el campo de categoría
        const newValue = name === 'categoria' ? primeraLetraMayuscula(value) : value;

        setSelectedCategoria({...selectedCategoria, [name]: newValue});
    }

    const handleFileChange = (e) => {
        const {name, files} = e.target;
        setSelectedCategoria({...selectedCategoria, [name]: files[0]});
    }

    const cambioCategoria = (selectedSubcategory, selectedCategoria) => {
        const isTrue = selectedCategoria.categoria === selectedSubcategory.nameCategory;
        const hasImageChanged = selectedCategoria.imgCategoria && selectedCategoria.imgCategoria instanceof File;
        const hasEstadoChanged = selectedCategoria.estado !== 'Activar'; // Comprobar si el estado ha cambiado

        return !isTrue || hasImageChanged || hasEstadoChanged;
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (colorButton) {
            const url = `http://localhost:3001/categorias/${tabla}/${id}`;

            const formData = new FormData();
            formData.append('categoria', selectedCategoria.categoria);
            formData.append('imgCategoria', selectedCategoria.imgCategoria);
            formData.append('estado', selectedCategoria.estado); // Enviar el estado seleccionado

            await sendPutRequest(url, formData);
        } 
    }

    useEffect(() => {
        if (!error && response) {
            onUpdate();
            onClick();
        }
    }, [error, response, onUpdate, onClick]);

    return(
        <>
            <form className="form-edit-categoria" onSubmit={handleSubmit}>
                <h2 className="titulo-edit-categoria">Editar</h2>
                <h3 className="categoria-edit">{categoria}</h3>

                <label htmlFor="categoria" className="label-form-edit-categoria">{tabla === 'categoria' ? 'Categoria' : 'Subcategoria'}:</label>
                <input 
                    type="text" 
                    name='categoria'
                    className="input-form-edit-categoria border-form-edit"
                    value={selectedCategoria.categoria}
                    onChange={handleChange}
                    />

                <label htmlFor="imgCategoria" className="label-form-edit-categoria">Imagen:</label>
                <input 
                    type="file" 
                    name="imgCategoria"
                    className="input-form-edit-categoria"
                    onChange={handleFileChange}
                    />

                <label htmlFor="estado" className="label-form-edit-categoria">Estado:</label>
                <select 
                    name="estado" 
                    className="input-form-edit-categoria"
                    value={selectedCategoria.estado}
                    onChange={handleChange}
                >
                    <option value="">Seleccionar</option>
                    <option value="Activa">Activar</option>
                    <option value="Deshabilitada">Deshabilitar</option>
                </select>

                {error && (
                    <p className="error-message">{error || "Ocurrió un error al actualizar la categoría"}</p>
                )}

                <div className="container-botones-edit-categoria">
                    <input type="submit" value='Editar' className={`button-edit-categoria ${colorButton ? 'change': ''}`} />
                    <button onClick={onClick}>Cancelar</button>
                </div>
            </form>
        </>
    );
}

export default FormEditarCategoria;
