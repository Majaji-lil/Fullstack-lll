package Reporte.reporte.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping; // 👈 Importante agregar
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Reporte.reporte.model.ReporteModel;
import Reporte.reporte.model.ReporteRequest;
import Reporte.reporte.model.UbicacionModel;
import Reporte.reporte.service.ReporteService;

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

    // 🌟 NUEVO MÉTODO: Para editar la información base del reporte (Soluciona el error 405)
    @PutMapping("/{id}")
    public ResponseEntity<ReporteModel> editar(@PathVariable Long id, @RequestBody ReporteRequest request) {
        return service.editar(id, request) // 👈 Nota: Debes crear el método "editar" en tu ReporteService
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/ubicacion")
    public ResponseEntity<ReporteModel> asignarUbicacion(@PathVariable Long id, @RequestBody UbicacionModel ubicacion) {
        return service.asignarUbicacion(id, ubicacion)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 🌟 NUEVO MÉTODO: Para eliminar un reporte (Completa tu CRUD)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        boolean eliminado = service.eliminar(id); // 👈 Nota: Debes crear el método "eliminar" en tu ReporteService
        if (eliminado) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
    
}