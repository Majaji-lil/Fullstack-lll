// src/api/urls.js

// Detecta automáticamente si está en Render o en tu computadora
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8090';

export const API_USUARIOS = `${API_BASE}/api/usuarios`;
export const API_MASCOTAS = `${API_BASE}/api/mascotas`;
export const API_REPORTES = `${API_BASE}/api/reportes`;