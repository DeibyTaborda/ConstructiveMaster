const mysql2 = require('../db/db-mysql2');

// Función para actualizar el estado de trabajos con fechas pasadas
exports.actualizarEstadoTrabajos = async() => {
    try {
        const query = `
            UPDATE trabajo
            SET estado = 'finalizado'
            WHERE fecha < CURDATE() 
            AND (estado = 'confirmado' OR estado = 'pendiente')
        `;

        const [result] = await mysql2.query(query);
        console.log(`Estados actualizados: ${result.affectedRows} filas modificadas`);
    } catch (error) {
        console.error('Error al actualizar los estados:', error);
    }
}
