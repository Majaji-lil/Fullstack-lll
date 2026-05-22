package Sanos_y_salvos.Fullstack_lll.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import Sanos_y_salvos.Fullstack_lll.model.MascotaDTO;

@Service
public class MascotaService {

    private final RestTemplate restTemplate;
    private final String mascotaServiceUrl;

    public MascotaService(@Value("${mascota.service.url}") String mascotaServiceUrl) {
        this.mascotaServiceUrl = mascotaServiceUrl;
        this.restTemplate = new RestTemplate();
    }

    public MascotaDTO obtenerMascotaPorId(Long id) {
        try {
            return restTemplate.getForObject(mascotaServiceUrl + "/api/mascotas/" + id, MascotaDTO.class);
        } catch (RestClientException ex) {
            return null;
        }
    }
}
