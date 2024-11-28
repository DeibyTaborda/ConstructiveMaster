
import React from 'react';
import '../../assets/styles/CartaContrato.css'; // Asegúrate de crear un archivo CSS para estilos

const CartaContrato = ({ contrato, obtenerId }) => {
    const { fecha_firma, fecha_inicio, fecha_fin, valor_total, forma_pago, estado_pago, contrato_id } = contrato;

    return (
        <div className="carta-contrato">
            <div className="carta-contrato-item">
                <span><strong>Fecha de firma:</strong> {new Date(fecha_firma).toLocaleDateString()}</span>
            </div>
            <div className="carta-contrato-item">
                <span><strong>Fecha de inicio:</strong> {new Date(fecha_inicio).toLocaleDateString()}</span>
            </div>
            <div className="carta-contrato-item">
                <span><strong>Fecha de fin:</strong> {fecha_fin ? new Date(fecha_fin).toLocaleDateString() : 'No especificada'}</span>
            </div>
            <div className="carta-contrato-item">
                <span><strong>Valor total:</strong> ${valor_total.toLocaleString()}</span>
            </div>
            <div className="carta-contrato-item">
                <span><strong>Forma de pago:</strong> {forma_pago}</span>
            </div>
            <div className="carta-contrato-item estado">
                <span><strong>Estado:</strong> 
                    <span className={`estado-${estado_pago}`}>
                        {` ${estado_pago}`}
                    </span>
                </span>
            </div>
            <div className="carta-contrato-item">
                <button className="btn-pagar" onClick={() => obtenerId(contrato_id)}>
                    Pagar
                </button>
            </div>
        </div>
    );
};

export default CartaContrato;
