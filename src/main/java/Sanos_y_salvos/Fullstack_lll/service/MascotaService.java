package Sanos_y_salvos.Fullstack_lll.service;

import java.util.List;

import org.springframework.stereotype.Service;

import Sanos_y_salvos.Fullstack_lll.model.MascotaModel;
import Sanos_y_salvos.Fullstack_lll.repository.MascotaRepository;

@Service
public class MascotaService {

    private final MascotaRepository repository;

    public MascotaService(MascotaRepository repository) {
        this.repository = repository;
    }

    public List<MascotaModel> listar() {
        return repository.findAll();
    }

    public MascotaModel guardar(MascotaModel mascota){
        return repository.save(mascota);
    }

    public MascotaModel encontrarporid(Long id){
        return repository.findById(id).orElse(null);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
