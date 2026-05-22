package Sanos_y_salvos.Fullstack_lll.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Sanos_y_salvos.Fullstack_lll.model.ReporteModel;
import Sanos_y_salvos.Fullstack_lll.model.ReporteRequest;
import Sanos_y_salvos.Fullstack_lll.model.UbicacionModel;
import Sanos_y_salvos.Fullstack_lll.service.ReporteService;

@RestController
@RequestMapping("api/reportes")
public class ReporteController {

    private final ReporteService service;

    public ReporteController(ReporteService service) {
        this.service = service;
    }

    @GetMapping
    public List<ReporteModel> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReporteModel> obtener(@PathVariable Long id) {
        return service.obtener(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ReporteModel> crear(@RequestBody ReporteRequest request) {
        ReporteModel reporte = service.guardar(request);
        if (reporte == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(reporte);
    }

    @PutMapping("/{id}/ubicacion")
    public ResponseEntity<ReporteModel> asignarUbicacion(@PathVariable Long id, @RequestBody UbicacionModel ubicacion) {
        return service.asignarUbicacion(id, ubicacion)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
