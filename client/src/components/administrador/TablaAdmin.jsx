import React, { useState, useEffect, useContext } from "react";
import '../../assets/styles/tablaAdmin.css';
import { FaFilePdf } from "react-icons/fa6";
import ButtonEditar from "./ButtonEditar";
import ButtonEliminar from "./ButtonEliminar";
import useDelete from "../../services/delete";
import SubcategoryContext from "../../context/SubcategoryContext";

function TablaAdmin({ columns, data, title, tableId, onClick, onClickEdit }) {
  const { setSelectedSubcategory, selectedSubcategory } = useContext(SubcategoryContext);

  const handleSelected = (id) => {
    onClick();
    const selectedCategoryId = data.find((row) => row.id === id);
    const selectedCategory = selectedCategoryId[tableId];
    setSelectedSubcategory({
      tableId,
      categoryId: id,
      nameCategory: selectedCategory,
    });
  };

  const handleSelectedEdit = (id) => {
    onClickEdit();
    const selectedCategoryId = data.find((row) => row.id === id);
    const selectedCategory = selectedCategoryId[tableId];
    setSelectedSubcategory({
      tableId,
      categoryId: id,
      nameCategory: selectedCategory,
    });
  }

  useEffect(() => {
    console.log(selectedSubcategory);
  }, [selectedSubcategory]);

  if (!data) return <p>loading...</p>

  return (
    <>
      <table key={tableId}>
        <caption className="title-table-admin">{title}</caption>
        <thead>
          <tr>
            {columns.map((columna, index) => (
              <th key={index}>{columna}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((column, index) => {
                if (column === "Acciones") {
                  return (
                    <td key={index}>
                      <ButtonEditar descripcion="Editar" onClick={() => handleSelectedEdit(row.id)} />
                      <ButtonEliminar id="boton-eliminar" onClick={() => handleSelected(row.id)} description="Eliminar" />
                    </td>
                  );
                } else if (column === "curriculum") {
                  return (
                    <td key={index}>
                      <FaFilePdf size={20} />
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
    </>
  );
}

export default TablaAdmin;
