import React, { useState } from 'react';
import '../../assets/styles/formEditarContrato.css';
export const mostrarFecha = (fecha) => {
  if (!fecha) return '';

  const date = new Date(fecha);
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2); // Añade un 0 si el mes es menor a 10
  const day = (`0${date.getDate()}`).slice(-2); // Añade un 0 si el día es menor a 10

  return `${year}-${month}-${day}`;
};

function FormularioEditarContrato({ data, solicitudPut, cerrarFormulario }) {
  const [formData, setFormData] = useState({
    fecha_firma: mostrarFecha(data.fecha_firma) || '',
    fecha_inicio: mostrarFecha(data.fecha_inicio),
    fecha_fin: mostrarFecha(data.fecha_fin) || '',
    valor_total: data.valor_total || '',
    forma_pago: data.forma_pago || 'transferencia',
    estado_pago: data.estado_pago || 'pendiente',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Función para comparar objetos
    const hasChanges = (obj1, obj2) =>
      Object.keys(obj1).some((key) => obj1[key] !== obj2[key]);

    if (hasChanges(data, formData)) {
      solicitudPut(formData);
      console.log('Formulario enviado:', formData);

    } else {
      alert('No se han realizado cambios.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='form-editar-contrato'>
      <h2>{`Contrato ${data.id_trabajo}`}</h2>
      <div>
        <label>Fecha Firma:</label>
        <input
          type="date"
          name="fecha_firma"
          value={formData.fecha_firma}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Fecha Inicio:</label>
        <input
          type="date"
          name="fecha_inicio"
          value={formData.fecha_inicio}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Fecha Fin:</label>
        <input
          type="date"
          name="fecha_fin"
          value={formData.fecha_fin}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Valor Total:</label>
        <input
          type="number"
          name="valor_total"
          value={formData.valor_total}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Forma de Pago:</label>
        <select
          name="forma_pago"
          value={formData.forma_pago}
          onChange={handleChange}
          required
        >
          <option value="transferencia">Transferencia</option>
          <option value="efectivo">Efectivo</option>
        </select>
      </div>
      <div>
        <label>Estado de Pago:</label>
        <select
          name="estado_pago"
          value={formData.estado_pago}
          onChange={handleChange}
          required
        >
          <option value="pendiente">Pendiente</option>
          <option value="pagado">Pago</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>
      <div className='contenedor-botones-editar-contrato'>
        <button type="submit">Enviar</button>
        <button onClick={cerrarFormulario}>Cancelar</button>
      </div>
    </form>
  );
}

export default FormularioEditarContrato;
