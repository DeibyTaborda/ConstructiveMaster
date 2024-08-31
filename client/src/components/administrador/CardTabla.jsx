import React, {useContext, useEffect, useState} from "react";
import '../../assets/styles/cardTabla.css';
import { Link } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import ReactDOM from 'react-dom';
import ButtonEditar from "./ButtonEditar";
import ButtonEliminar from "./ButtonEliminar";
import useDelete from "../../services/delete";
import FormEditTabla from "../super-administrador/FormEditTabla";
import TarjetaConfirmEliminarTabla from "../super-administrador/TarjetaConfirmEliminarTabla";
import { UsuarioContexto } from "../../context/UsuarioContexto";

function CardTabla({nombreTabla, urlTabla, imagenTabla, rol, id,fetchData, datos}) {
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [isOpenEdit, setIsOpenEdit] = useState(false);

    const {loading, error, response, eliminar} = useDelete(`http://localhost:3001/panel_de_control/${id}`);
    const {usuario} = useContext(UsuarioContexto);

    const handleSubmit = () => {
        eliminar();
        setIsOpenDelete(false);
    }

    useEffect(() => {
        if (error || response){
            fetchData();
        }
    }, [error, response])

    const openDelete = () => {
        setIsOpenDelete(true);
        setIsOpenEdit(false);
    }

    
    const openEdit = () => {
        setIsOpenEdit(true);
        setIsOpenDelete(false);
    }

    const handleSubmit2 = () => {
        fetchData();
        setIsOpenEdit(false);
    }

    return (
        <>
            <div className="container-card-tabla">
                <Link to={`/${urlTabla}`} className="card-tabla-link">
                    <div className="nombre-img-tabla">
                        <h2>{nombreTabla}</h2>
                    </div>
                    <img src={imagenTabla} alt="tabla" className="imagen-tabla" />
                </Link>
                {usuario.rol === 'super_admin' && (
                        <div className="container-icon-delete-tabla">
                            <MdDelete className="icon-delete-tabla" onClick={openDelete}/>
                            <MdEdit className="icon-delete-tabla" onClick={openEdit}/>
                            {isOpenDelete && (
                            <div className="confirm-delete-tabla">
                                <TarjetaConfirmEliminarTabla onClick={() => setIsOpenDelete(false)} onClick2={handleSubmit}/>
                            </div>
                            )}
                            {isOpenEdit && (
                                <div className="container-form-edit-tabla">
                                    <FormEditTabla onClick={handleSubmit2} datos={datos} id={id}/>
                                </div>
                            )}
                        </div>
                    )}
            </div>
        </>
    );
}

export default CardTabla;
