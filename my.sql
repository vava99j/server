DROP DATABASE IF EXISTS railway;

CREATE DATABASE railway;
USE railway;

CREATE TABLE usuarios (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    telefone VARCHAR(20) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE plantas (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNSIGNED NOT NULL,
    horarios TEXT, -- Um campo de texto maior para anotações
    foto_url VARCHAR(255) NULL,
    CONSTRAINT fk_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE -- Se o usuário for deletado, todas as suas plantas também serão.
);