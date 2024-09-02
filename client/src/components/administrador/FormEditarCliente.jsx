import React, { useEffect, useState } from "react";
import '../../assets/styles/formEditarCliente.css';

function FormEditarCliente({datos, solicitudPUT}) {
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
                <label htmlFor="nombre" className="label-form-editar-cliente">Nombre:</label>
                <input 
                    type="text" 
                    name="nombre" 
                    className="input-form-editar-cliente"
                    onChange={handleOnchange}
                    value={data.nombre}
                />
                <label htmlFor="correo" className="label-form-editar-cliente">Correo:</label>
                <input 
                    type="text" 
                    name="correo"
                    className="input-form-editar-cliente"
                    onChange={handleOnchange}
                    value={data.correo}
                />
                <label htmlFor="telefono" className="label-form-editar-cliente">Teléfono:</label>
                <input 
                    type="number" 
                    name="telefono"
                    className="input-form-editar-cliente"
                    onChange={handleOnchange}
                    value={data.telefono}
                />
                <label htmlFor="direccion" className="label-form-editar-cliente">Dirección:</label>
                <input 
                    type="text" 
                    name="direccion"
                    className="input-form-editar-cliente"
                    value={data.direccion}
                    onChange={handleOnchange}
                />
                <label htmlFor="imagen" className="label-form-editar-cliente">Imagen:</label>
                <input 
                    type="file" 
                    name="imagen"
                    className="input-form-editar-cliente"
                    onChange={handleFileOnchange}
                />
                <input type="submit" />
            </form>
        </>
    ); 
}

export default FormEditarCliente;