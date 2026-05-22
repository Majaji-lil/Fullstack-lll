package Sanos_y_salvos.Fullstack_lll.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import Sanos_y_salvos.Fullstack_lll.model.UbicacionModel;
import Sanos_y_salvos.Fullstack_lll.repository.UbicacionRepository;

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
