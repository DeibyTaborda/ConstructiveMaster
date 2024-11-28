CREATE DATABASE constructivemaster;
USE constructivemaster;

CREATE TABLE rol(
    id INT AUTO_INCREMENT PRIMARY KEY,
    rol VARCHAR(20) NOT NULL,
    
);

CREATE TABLE cliente(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    contrasena VARCHAR(100) NOT NULL,
    telefono INT(10) NULL,
    direccion VARCHAR(20) NULL,
    estado ENUM('Activo', 'Deshabilitado') DEFAULT 'Activo';
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categoria(
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(30) NOT NULL,
    img_categoria VARCHAR(255) DEFAULT NULL,
    estado ENUM('Activa', 'Deshabilitada') DEFAULT 'Activa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subcategoria(
    id INT AUTO_INCREMENT PRIMARY KEY,
    subcategoria VARCHAR(30) NOT NULL,
    img_subcategoria VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Activa', 'Deshabilitada') DEFAULT 'Activa',
    id_categoria INT,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id)
);

CREATE TABLE solicitud(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL,
    apellido VARCHAR(30) NOT NULL,
    especialidad VARCHAR(20) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(10) NOT NULL,
    curriculum VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE super_admin(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(10) NULL,
    contrasena VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL,
    apellido VARCHAR(30) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(10) NOT NULL,
    contrasena VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

CREATE TABLE profesional(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL,
    apellido VARCHAR(30) NOT NULL,
    especialidad VARCHAR(30) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(10) NOT NULL,
    curriculum VARCHAR(100) NOT NULL,
    contrasena VARCHAR(100) NOT NULL,
    campos_personalizados JSON,
    descripcion VARCHAR(400) NULL;
    estado ENUM('Disponible','Inactivo', 'Suspendido', 'Retirado', 'Bloqueado') NOT NULL DEFAULT 'Disponible',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE imagenTabla(
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tabla VARCHAR(30) NOT NULL,
    url_tabla VARCHAR(30) NOT NULL,
    imagen_tabla VARCHAR(100) NULL
);

CREATE TABLE trabajo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_profesional INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    direccion VARCHAR(30) NOT NULL,
    descripcion TEXT,
    valor INT NOT NULL,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin DATE NULL,
    estado ENUM('pendiente', 'confirmado', 'en_progreso', 'finalizado', 'cancelado', 'rechazado') NOT NULL DEFAULT 'pendiente',
    FOREIGN KEY (id_cliente) REFERENCES cliente(id),
    FOREIGN KEY (id_profesional) REFERENCES profesional(id)
);

CREATE TABLE contrato (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha_firma DATE NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    valor_total INT NOT NULL,
    forma_pago ENUM('Transferencia', 'Efectivo') NOT NULL DEFAULT 'Transferencia',
    id_trabajo INT,
    estado ENUM('pendiente', 'pagado', 'cancelado') NOT NULL DEFAULT 'pendiente',
    FOREIGN KEY (id_trabajo) REFERENCES trabajo(id)
);

CREATE TABLE imagen_profesional (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_profesional INT NOT NULL,
    imagen VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_profesional) REFERENCES profesional(id)
);


CREATE TABLE logs_actividades(
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    usuario_id INT NOT NULL,
    rol ENUM('profesional', 'administrador', 'superadministrador', 'cliente'),
    accion VARCHAR(255),
    detalles TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

//Triggers
DELIMITER //

CREATE TRIGGER cambio_contrasena_cliente
AFTER UPDATE ON cliente
FOR EACH ROW 
BEGIN
    IF OLD.contrasena <> NEW.contrasena THEN
        INSERT INTO logs_actividades(usuario_id, rol, accion, detalles, created_at)
        VALUES(NEW.id, 'cliente', 'Cambio de contraseña', 'El cliente cambió su contraseña.', NOW());
    END IF;
END //

DELIMITER ;

/*Este trigger aún no se ha implementado*/
DELIMITER //
CREATE TRIGGER cambio_contrasena_profesional
AFTER UPDATE ON profesional
FOR EACH ROW 
BEGIN
    IF OLD.contrasena <> NEW.contrasena THEN
        INSERT INTO logs_actividades(usuario_id, rol, accion, detalles, created_at)
        VALUES(NEW.id, 'profesional', 'Cambio de contraseña', 'Su contraseña ha sido cambiada exitosamente.', NOW());
    END IF;
END //

DELIMITER ;

/*Trigger que se ejecuta cuando un cliente envia una solicitud para contratar un profesional*/
DELIMITER //

CREATE TRIGGER solicitud_trabajo
AFTER INSERT ON trabajo
FOR EACH ROW
BEGIN
    INSERT INTO logs_actividades(usuario_id, rol, accion, detalles, created_at)
    VALUES(NEW.id_cliente, 'cliente', 'Contrato de un profesional', 'Enviaste una solicitud para contratar un profesional.', NOW());
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER actualizar_estado_trabajo
AFTER UPDATE ON contrato
FOR EACH ROW 
BEGIN
    IF NEW.estado_pago = 'pagado' THEN
        UPDATE trabajo
        SET estado = 'finalizado'
        WHERE id = NEW.id_trabajo; -- Asegúrate de que id_trabajo se refiere al trabajo relacionado
    END IF;
END //

DELIMITER ;

