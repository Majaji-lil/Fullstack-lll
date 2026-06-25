CREATE DATABASE IF NOT EXISTS sanosysalvos;
CREATE DATABASE IF NOT EXISTS user;
CREATE DATABASE IF NOT EXISTS reporte;


CREATE DATABASE IF NOT EXISTS reportes;

GRANT ALL PRIVILEGES ON sanosysalvos.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON user.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON reportes.* TO 'root'@'%';
FLUSH PRIVILEGES;

-- ===== TABLA DE USUARIOS =====
USE user;

CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombres VARCHAR(100) NOT NULL
);

-- Insertar usuarios de prueba
INSERT IGNORE INTO usuario (id, correo, password, nombres) 
VALUES 
    (1, 'admin@sanosysalvos.cl', 'admin1234', 'Administrador'),
    (2, 'juan@correo.com', 'password123', 'Juan Pérez'),
    (3, 'maria@correo.com', 'password456', 'María García'),
    (4, 'carlos@correo.com', 'password789', 'Carlos López'),
    (5, 'ana@correo.com', 'passwordabc', 'Ana Martínez');

-- ===== TABLA DE MASCOTAS =====
USE sanosysalvos;

CREATE TABLE IF NOT EXISTS Mascotas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    raza VARCHAR(50),
    color_caracteristica VARCHAR(100),
    tamano VARCHAR(50)
);

-- Insertar mascotas de prueba
INSERT IGNORE INTO Mascotas (id, nombre, especie, raza, color_caracteristica, tamano) 
VALUES 
    (1, 'Firulais', 'Perro', 'Labrador', 'Amarillo', 'Grande'),
    (2, 'Luna', 'Gato', 'Siamés', 'Blanco y café', 'Pequeño'),
    (3, 'Max', 'Perro', 'Pastor Alemán', 'Negro y café', 'Grande'),
    (4, 'Bella', 'Gato', 'Persa', 'Gris', 'Mediano'),
    (5, 'Rex', 'Perro', 'Bulldog', 'Blanco', 'Mediano');

-- ===== TABLA DE UBICACIONES =====
USE sanosysalvos;

CREATE TABLE IF NOT EXISTS ubicaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    comuna VARCHAR(100),
    latitud VARCHAR(50) NOT NULL,
    longitud VARCHAR(50) NOT NULL
);

-- Insertar ubicaciones de prueba
INSERT IGNORE INTO ubicaciones (id, comuna, latitud, longitud) 
VALUES 
    (1, 'Santiago', '-33.4489', '-70.6693'),
    (2, 'Las Condes', '-33.3848', '-70.5776'),
    (3, 'Providencia', '-33.4243', '-70.6025'),
    (4, 'Ñuñoa', '-33.4264', '-70.5778'),
    (5, 'La Reina', '-33.3941', '-70.5375');

-- ===== TABLA DE REPORTES =====
USE sanosysalvos;

CREATE TABLE IF NOT EXISTS reportes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuarioId BIGINT,
    usuarioNombre VARCHAR(100),
    descripcion TEXT NOT NULL,
    fechaHora DATETIME,
    mascotaId BIGINT NOT NULL,
    mascotaNombre VARCHAR(100) NOT NULL,
    longitud DOUBLE NOT NULL,
    latitud DOUBLE NOT NULL
);

-- Insertar reportes de prueba (después de usuarios y mascotas)
INSERT IGNORE INTO reportes (id, usuarioId, usuarioNombre, descripcion, fechaHora, mascotaId, mascotaNombre, longitud, latitud) 
VALUES 
    (1, 2, 'Juan Pérez', 'Perro perdido en Parque Bustamante', '2024-06-20 14:30:00', 1, 'Firulais', -70.6693, -33.4489),
    (2, 3, 'María García', 'Gato extraviado en sector residencial', '2024-06-21 09:15:00', 2, 'Luna', -70.5776, -33.3848),
    (3, 4, 'Carlos López', 'Perro encontrado en calle principal', '2024-06-22 16:45:00', 3, 'Max', -70.6025, -33.4243),
    (4, 5, 'Ana Martínez', 'Mascota avistada en la comuna', '2024-06-23 11:20:00', 4, 'Bella', -70.5778, -33.4264),
    (5, 2, 'Juan Pérez', 'Búsqueda activa de mascota perdida', '2024-06-24 10:00:00', 5, 'Rex', -70.5375, -33.3941);