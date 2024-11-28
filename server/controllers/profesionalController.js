const dbMysql2 = require('../db/db-mysql2');

exports.obtenerTrabajos = async(req, res) => {
    const {idProfesional} = req.query;
    console.log(idProfesional)

    try {
        const seleccionarTrabajos = 'SELECT trabajo.*, cliente.nombre AS nombre_cliente FROM trabajo JOIN cliente ON trabajo.id_cliente = cliente.id WHERE trabajo.id_profesional = ?';
        const [trabajos] = await dbMysql2.query(seleccionarTrabajos, [idProfesional]);
        res.status(200).json(trabajos);
    } catch (error) {
        res.status(500).json({ message: 'No se puedo obtener los trabajos' });
    }
}
  
exports.obenerActividades = async(req, res) => {
    const id = req.id;
    const rol = req.rol;

    try {
        const [actividades] = await dbMysql2.query('SELECT * FROM logs_actividades WHERE usuario_id = ? AND rol = ?', [id, rol]);
        res.status(200).json(actividades);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor'});
    }
}

exports.obtenerCamposPersonalizados = async (req, res) => {
  const { id } = req.params;
  try {
    const [profesional] = await dbMysql2.query('SELECT campos_personalizados FROM profesional WHERE id = ?', [id]);
    if (profesional.length === 0) {
      return res.status(404).json({ message: 'Profesional no encontrado' });
    }

    res.json(JSON.parse(profesional[0].campos_personalizados || '[]'));
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.actualizarCamposPersonalizados = async (req, res) => {
  const { id } = req.params;
  const camposPersonalizados = req.body;
  console.log(camposPersonalizados)
  
  if (camposPersonalizados.length > 10) {
    return res.status(400).json({ message: 'Solo se pueden añadir hasta 10 campos personalizados.' });
  }

  try {
    await dbMysql2.query('UPDATE profesional SET campos_personalizados = ? WHERE id = ?', [JSON.stringify(camposPersonalizados), id]);
    res.status(200).json({ message: 'Campos personalizados actualizados exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};


exports.actualizarDescripcion = async(req, res) => {
  const {descripcion} = req.body;
  const id = req.id;
  const cambiarDescripcion = 'UPDATE profesional SET descripcion = ? WHERE id = ?';
  try {
    await dbMysql2.query(cambiarDescripcion, [descripcion, id]);
    res.status(200).json({ message: 'La descripción se actulaizó exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor'});
  }
};

exports.obterDescripcion = async(req, res) => {
  const id = req.id;
  try {
    const [descripcion] = await dbMysql2.query('SELECT descripcion FROM profesional WHERE id = ?', [id]);
    res.status(200).json(descripcion[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

exports.subirImagenProfesional = async (req, res) => {
  const id = req.id;
  const archivo = req.file.path;
  const tipoArchivo = req.file.mimetype;

  // Validar que el archivo sea una imagen
  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']; // Tipos de imagen permitidos
  if (!tiposPermitidos.includes(tipoArchivo)) {
    return res.status(400).json({ message: 'Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)' });
  }

  try {
    const [result] = await dbMysql2.query('SELECT COUNT(*) AS total FROM imagen_profesional WHERE id_profesional = ?', [id]);
    const totalImagenes = result[0].total;

    if (totalImagenes >= 6) {
      return res.status(400).json({ message: 'No se permite subir más de 6 imágenes' });
    }

    const sql = 'INSERT INTO imagen_profesional (id_profesional, imagen) VALUES (?, ?)';
    await dbMysql2.query(sql, [id, archivo]);

    res.status(200).json({ message: 'La imagen se subió exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};


exports.obtenerImagenes = async(req, res) => {
  const id = req.id;
  try {
    const sql = 'SELECT id, imagen FROM imagen_profesional WHERE id_profesional = ?';
    const[imagenes] = await dbMysql2.query(sql, [id]);
    res.status(200).json(imagenes);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

exports.eliminarImagenProfesional = async(req, res) => {
  const {id} = req.params;
  console.log(id)
  try {
    const sql = 'DELETE FROM imagen_profesional WHERE id = ?';

    await dbMysql2.query(sql, [id]);
    res.status(200).json({ message: 'Imagen eliminada con exito'});
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.procesarPago = async(req, res) => {
  const { idContrato, tokenStripe } = req.body;
  console.log(req.body);

  if (!idContrato || !tokenStripe) {
    return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
  }

  try {
    // Obtener el valor del contrato
    const [contrato] = await dbMysql2.query('SELECT valor_total FROM contrato WHERE id = ?', [idContrato]);
    
    if (!contrato || contrato.length === 0) {
      return res.status(404).json({ mensaje: 'Contrato no encontrado' });
    }

    const valorTotal = contrato[0].valor_total;

    // Crear el pago en Stripe
    const pago = await stripe.paymentIntents.create({
      amount: valorTotal * 100, // Stripe espera el monto en centavos
      currency: 'usd',
      return_url: 'http://localhost:3000/login',
      payment_method: tokenStripe,
      confirmation_method: 'manual',
      confirm: true,
      description: `Pago por contrato ${idContrato}`
    });

    if (pago.status === 'succeeded') {
      // Actualizar el estado del contrato a 'pagado'
      await dbMysql2.query('UPDATE contrato SET estado_pago = ? WHERE id = ?', ['pagado', idContrato]);

      res.status(200).json({ mensaje: 'Pago procesado exitosamente', idPago: pago.id });
    } else {
      throw new Error('El pago no se completó correctamente');
    }
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    res.status(500).json({ mensaje: 'No se pudo procesar el pago' });
  }
};

exports.seleccionarContratos = async(req, res) => {
  const id = req.id;
  try {
    const sql =  `SELECT 
    contrato.id AS contrato_id,
    contrato.fecha_firma,
    contrato.fecha_inicio,
    contrato.fecha_fin,
    contrato.valor_total,
    contrato.forma_pago,
    contrato.estado_pago,
    trabajo.id AS trabajo_id,
    trabajo.estado AS estado_trabajo
FROM 
    contrato
JOIN 
    trabajo ON contrato.id_trabajo = trabajo.id
JOIN 
    profesional ON trabajo.id_profesional = profesional.id
WHERE 
    trabajo.estado = 'confirmado' 
    AND profesional.id = ?;`

    const [contratos] = await dbMysql2.query(sql, [id]);
    res.status(200).json(contratos);
  } catch (error) {
    console.error('esto es un error', error)
    res.status(500).json({ message: 'Error en el servidor' });
  }
}