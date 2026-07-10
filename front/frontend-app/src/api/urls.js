// src/api/urls.js

// URL Base: Aquí pones la URL de tu API Gateway en Render
export const API_BASE = 'https://api-gateway-jyfs.onrender.com'; 

// Todas las rutas van a través del Gateway usando la API_BASE
export const API_MASCOTAS = `${API_BASE}/api/mascotas`;
export const API_USUARIOS = `${API_BASE}/api/usuarios`;
export const API_REPORTES = `${API_BASE}/api/reportes`;