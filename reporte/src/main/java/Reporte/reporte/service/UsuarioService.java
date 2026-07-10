package Reporte.reporte.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import Reporte.reporte.model.UsuarioDTO;

@Service
public class UsuarioService {

    private final RestTemplate restTemplate;
    private final String usuarioServiceUrl;

    public UsuarioService(@Value("${usuario.service.url}") String usuarioServiceUrl) {
        this.usuarioServiceUrl = usuarioServiceUrl;
        this.restTemplate = new RestTemplate();
    }

    public UsuarioDTO obtenerUsuarioPorId(long id) {
        try {
            return restTemplate.getForObject(
                    usuarioServiceUrl + "/api/usuarios/" + id,
                    UsuarioDTO.class);
        } catch (RestClientException ex) {
            return null;
        }
    }
}