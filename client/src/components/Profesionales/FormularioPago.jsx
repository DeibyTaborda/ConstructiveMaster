import React, { useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import '../../assets/styles/formularioPago.css';
import axios from 'axios';

const FormularioPago = ({ idContrato, confirmarPago, quitarId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [mensajeError, setMensajeError] = useState(null);
    const [exitoPago, setExitoPago] = useState(false);
    const [cargando, setCargando] = useState(false);

    const manejarEnvio = async (evento) => {
        evento.preventDefault();
        
        if (!stripe || !elements) {
            return;
        }

        setCargando(true);
        setMensajeError('');
        setExitoPago(false);
    
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
        });
    
        if (error) {
            setMensajeError(error.message);
            setCargando(false);
            return;
        }
    
        try {
            const respuesta = await axios.post('http://localhost:3001/procesar-pago', {
                idContrato,
                tokenStripe: paymentMethod.id,
            });
    
            if (respuesta.data.mensaje === 'Pago procesado exitosamente') {
                setExitoPago(true);
                confirmarPago(true);
                setTimeout(() => {
                    setExitoPago('');
                    confirmarPago(false);
                }, 3000);
            }
        } catch (error) {
            setMensajeError(error.response?.data?.mensaje || 'Error al procesar el pago. Por favor, intenta de nuevo.');
        }

        setCargando(false);
    };

    useEffect(() => {
        return () => {
            quitarId(); // Esta función se ejecutará al desmontar el componente
        };
    }, []); // El arreglo vacío significa que solo se ejecutará al montar y desmontar
    

    return (
        <div className="pago-container">
            <h2>Realizar Pago</h2>
            <form onSubmit={manejarEnvio} className="formulario-pago">
                <div className="card-element-container">
                    <CardElement className="card-element" />
                </div>
                <button type="submit" disabled={!stripe || cargando} className="pago-boton">
                    {cargando ? 'Procesando...' : 'Pagar'}
                </button>
                <p onClick={quitarId}>Cancelar</p>
                {mensajeError && <p className="pago-error">Error: {mensajeError}</p>}
                {exitoPago && <p className="pago-exito">¡Pago realizado con éxito!</p>}
            </form>
        </div>
    );
};

export default FormularioPago;