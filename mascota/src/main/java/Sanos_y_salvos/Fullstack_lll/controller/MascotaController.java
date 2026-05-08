package Sanos_y_salvos.Fullstack_lll.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Sanos_y_salvos.Fullstack_lll.model.MascotaModel;
import Sanos_y_salvos.Fullstack_lll.service.MascotaService;



@RestController
@RequestMapping("api/mascotas")
public class MascotaController {

    private final MascotaService service;

    public MascotaController(MascotaService service) {
        this.service = service;
    }

    @GetMapping
    public List<MascotaModel> listar(){
        return service.listar();
    }

    @PostMapping
    public MascotaModel guardar(@RequestBody MascotaModel mascota){
        return service.guardar(mascota);
    }

    @GetMapping("/{id}")
    public MascotaModel obtener(@PathVariable Long id) {
        return service.encontrarporid(id);
    }
    
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }

}
