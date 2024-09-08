import React, { useState, useEffect, useContext } from "react";
import '../../assets/styles/tablaAdmin.css';
import { FaFilePdf } from "react-icons/fa6";
import ButtonEditar from "./ButtonEditar";
import ButtonEliminar from "./ButtonEliminar";
import useDelete from "../../services/delete";
import SubcategoryContext from "../../context/SubcategoryContext";
import { MdOutlinePassword } from "react-icons/md";
import { BsImage } from "react-icons/bs";

function TablaAdmin({ columns, data, title, tableId, onClick, onClickEdit, acciones }) {
  const { setSelectedSubcategory, selectedSubcategory } = useContext(SubcategoryContext);
  const [id, setId] = useState(null);

  const handleSelected = (id) => {
    if (['clientes', 'solicitud_profesional', 'profesionales', 'trabajos'].includes(tableId)) {
      return onClick(id);
    }
    onClick();
    if (['subcategoria', 'categoria'].includes(tableId)) {
      acciones(id, data, tableId);
    }
  }

  const handleSelectedEdit = (id) => {
    if (['clientes', 'solicitud_profesional', 'profesionales', 'trabajos'].includes(tableId)) {
      return onClickEdit(id);
    }
    onClickEdit();
    if (['subcategoria', 'categoria'].includes(tableId)) {
      acciones(id, data, tableId);
    }
  }

  const renderButtons = (id) => {
    if (tableId === 'solicitud_profesional') {
      return (
        <>
          <ButtonEditar descripcion="Aceptar" onClick={() => handleSelectedEdit(id)} />
          <ButtonEliminar onClick={() => handleSelected(id)} description="Rechazar" />
        </>
      );
    } else if (tableId === 'trabajos') {
      return (
        <>
          <ButtonEditar descripcion="Confirmar" onClick={() => handleSelectedEdit(id)} />
          <ButtonEliminar onClick={() => handleSelected(id)} description="Cancelar" />
        </>
      );
    } else if (tableId === 'contratos') {
      return(
        <>
          <ButtonEditar descripcion="Editar" onClick={() => handleSelectedEdit(id)} />
        </>
      );
    } else {
      return (
        <>
          <ButtonEditar descripcion="Editar" onClick={() => handleSelectedEdit(id)} />
          <ButtonEliminar onClick={() => handleSelected(id)} description="Eliminar" />
        </>
      );
    }
  };

  useEffect(() => {
    if (selectedSubcategory){
      console.log(selectedSubcategory);
    }
  }, [selectedSubcategory]); 

  if (!data) return <p>loading...</p>

  return (
    <div className="contenedor-general-tabla-admin">
      <h2 className="title-table-admin">{title}</h2>
          <div className="table-container">
      
        <table key={tableId}>
            <thead>
                <tr>
                    {columns.map((columna, index) => (
                        <th key={index}>{columna}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data && data.map((row) => (
                    <tr key={row.id}>
                        {columns.map((column, index) => {
                            if (column === "Acciones") {
                                return (
                                    <td key={index}>
                                        <div className="contenedor-botones-tabla-admin">
                                            {renderButtons(row.id)}
                                        </div>
                                    </td>
                                );
                            } else if (column === "curriculum") {
                                return (
                                    <td key={index}>
                                        {row.curriculum ? <FaFilePdf size={20} /> : ''}
                                    </td>
                                );
                            } else if (column === 'contrasena') {
                                return (
                                    <td key={index}>
                                        {row.contrasena ? <MdOutlinePassword size={20} /> : ''}
                                    </td>
                                );
                            } else if (column === 'imagen') {
                                  return(
                                    <td key={index}>
                                        {row.imagen ? <BsImage size={20} /> : ''}
                                    </td>
                                  );
                            } else if (column === 'id_categoria') {
                                return (
                                    <td key={index}>
                                        {row.id_categoria === 1 ? 'Diseño y planificación' : 'Ejecución'}
                                    </td>
                                );
                            } else {
                                return <td key={index}>{row[column]}</td>;
                            }
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
        {selectedSubcategory && (
            <>
                <p>{selectedSubcategory.tableId}</p>
                <p>{selectedSubcategory.nameCategory}</p>
                <p>{selectedSubcategory.categoryId}</p>
            </>
        )}
    </div>
    </div>
);
}

export default TablaAdmin;
