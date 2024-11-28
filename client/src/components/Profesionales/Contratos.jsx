import React, { useState } from "react";
import CartaContrato from "./CartaContrato";
import FormularioPago from "./FormularioPago";
import { Elements } from '@stripe/react-stripe-js'; 
import { loadStripe } from '@stripe/stripe-js'; 
import '../../assets/styles/contratos.css';
import { FaCheckCircle } from "react-icons/fa";


// Cargar la clave pública de Stripe
const stripePromise = loadStripe('pk_test_51Q4Zz4KSXiVTjHA0ZMQajmz0dTVQFN0vjZrDVq1GuUH27rq5Sdo9lFZnPpQuIvIZreVY3Mnh0YO57TG5EOi2ACJ500WlWLB8GZ');

function Contratos({ contratos, obtenerId, idContrato, quitarId }) {
    const [pagoExitoso, setPagoExitoso] = useState(false);
    const contrato = contratos.find(contrato => contrato.contrato_id === idContrato);

    const isPagoExitoso = (valor) => {
        setPagoExitoso(valor);
        quitarId();
    }
    return (
        <div className="contenedor-cartas-contratos-pagos">
            <h2>Realizar pagos</h2>
            {/* Mostrar las cartas de contrato si no existe un idContrato */}
            {!idContrato && contratos && contratos.map(contrato => (
                <CartaContrato
                    key={contrato.id}
                    contrato={contrato}
                    obtenerId={obtenerId}
                />
            ))}

            {/* Mostrar el formulario de pago si existe un idContrato */}
            {idContrato && (
                <div className="contenedor-pagos">
                    <div className="payment-info">
                        <h2>Detalles del Contrato</h2>
                        <p>{`Id: ${idContrato}`}</p>
                        <p>{`Pagar: ${contrato?.valor_total}`}</p>
                    </div>
                    <Elements stripe={stripePromise}>
                        <FormularioPago idContrato={idContrato} confirmarPago={isPagoExitoso} quitarId={quitarId}/>
                    </Elements>
                </div>
            )}

            {pagoExitoso && (
                <div className="contenedor-pagos">
                    <FaCheckCircle className="pago-exitoso"/>
                    <p className="pago-exitoso-p">Pago exitoso</p>
                </div>
            )}

            {contratos.length === 0 && (
                <div className="contenedor-pagos">
                    <p className="sin-contratos-a-pagar">¡Muy bien, estas al día!</p>
                </div>
            )}
        </div>
    );
}

export default Contratos;
