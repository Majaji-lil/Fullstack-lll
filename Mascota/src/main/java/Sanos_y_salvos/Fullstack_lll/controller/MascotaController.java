package Sanos_y_salvos.Fullstack_lll.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.PutMapping;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

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
    public List<MascotaModel> listar() {
        return service.listar();
    }

    @PostMapping
    public MascotaModel guardar(@RequestBody MascotaModel mascota) {
        return service.guardar(mascota);
    }

    @GetMapping("/{id}")
    public MascotaModel obtener(@PathVariable Long id) {
        return service.encontrarporid(id);
    }

    @PutMapping("/{id}")
    public MascotaModel actualizar(@PathVariable Long id, @RequestBody MascotaModel mascota) {
        return service.actualizar(id, mascota);

    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }

    @PostMapping("/{id}/foto")
    public ResponseEntity<Void> subirFoto(
            @PathVariable Long id,
            @RequestParam("archivo") MultipartFile archivo) {
        try {
            MascotaModel mascota = service.encontrarporid(id);
            if (mascota == null)
                return ResponseEntity.notFound().build();
            mascota.setFoto(archivo.getBytes());
            service.guardar(mascota);
            return ResponseEntity.ok().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}/foto")
    public ResponseEntity<byte[]> obtenerFoto(@PathVariable Long id) {
        MascotaModel mascota = service.encontrarporid(id);
        if (mascota == null || mascota.getFoto() == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(mascota.getFoto());
    }

}
