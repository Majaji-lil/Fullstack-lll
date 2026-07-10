// src/api/urls.js

// Si existen las variables de Render las usa, si no, usa el localhost correspondiente
export const API_USUARIOS = import.meta.env.VITE_API_USUARIOS || 'http://localhost:8090/api/usuarios';
export const API_MASCOTAS = import.meta.env.VITE_API_MASCOTAS || 'http://localhost:8090/api/mascotas';
export const API_REPORTES = import.meta.env.VITE_API_REPORTES || 'http://localhost:8090/api/reportes';

// Mantén esta si tus componentes la usan para cargar imágenes o URL base
export const API_BASE = import.meta.env.VITE_API_MASCOTAS || 'http://localhost:8090';