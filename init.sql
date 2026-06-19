CREATE DATABASE IF NOT EXISTS sanosysalvos;
CREATE DATABASE IF NOT EXISTS user;
CREATE DATABASE IF NOT EXISTS reporte;


CREATE DATABASE IF NOT EXISTS reportes;

GRANT ALL PRIVILEGES ON sanosysalvos.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON user.* TO 'root'@'%';
GRANT ALL PRIVILEGES ON reportes.* 'root'@'%';
FLUSH PRIVILEGES;

USE user;

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL
);

INSERT IGNORE INTO usuarios (id, username, password, email, rol) 
VALUES (1, 'admin', 'admin1234', 'admin@sanosysalvos.cl', 'ADMIN');