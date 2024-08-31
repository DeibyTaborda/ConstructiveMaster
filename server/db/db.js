const mysql = require('mysql');

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'constructivemaster'
});

connection.connect(error => {
    if(error){
        return console.error('Error en la conexión a la base de datos');
    } else {
        return console.log('Conexion exitosa a la base de datos');
    }
})

module.exports = connection;
