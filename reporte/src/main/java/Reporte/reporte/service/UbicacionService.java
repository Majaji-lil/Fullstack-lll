package Reporte.reporte.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import Reporte.reporte.model.UbicacionModel;
import Reporte.reporte.repository.UbicacionRepository;

@Service
public class UbicacionService {

    private final UbicacionRepository repository;

    public UbicacionService(UbicacionRepository repository) {
        this.repository = repository;
    }

    public List<UbicacionModel> listar() {
        return repository.findAll();
    }

    public Optional<UbicacionModel> encontrarPorId(Long id) {
        return repository.findById(id);
    }

    public UbicacionModel guardar(UbicacionModel ubicacion) {
        return repository.save(ubicacion);
    }
}
