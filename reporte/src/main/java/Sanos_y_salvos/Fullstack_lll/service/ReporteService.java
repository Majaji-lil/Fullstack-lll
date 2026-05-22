package Sanos_y_salvos.Fullstack_lll.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import Sanos_y_salvos.Fullstack_lll.model.ReporteModel;
import Sanos_y_salvos.Fullstack_lll.model.ReporteRequest;
import Sanos_y_salvos.Fullstack_lll.model.UbicacionModel;
import Sanos_y_salvos.Fullstack_lll.repository.ReporteRepository;
import Sanos_y_salvos.Fullstack_lll.service.UbicacionService;

@Service
public class ReporteService {

    private final ReporteRepository repository;
    private final MascotaService mascotaService;
    private final UbicacionService ubicacionService;

    public ReporteService(ReporteRepository repository, MascotaService mascotaService, UbicacionService ubicacionService) {
        this.repository = repository;
        this.mascotaService = mascotaService;
        this.ubicacionService = ubicacionService;
    }

    public List<ReporteModel> listar() {
        return repository.findAll();
    }

    public Optional<ReporteModel> obtener(Long id) {
        return repository.findById(id);
    }

    public ReporteModel guardar(ReporteRequest request) {
        if (request == null || request.getMascotaId() == null) {
            return null;
        }

        var mascota = mascotaService.obtenerMascotaPorId(request.getMascotaId());
        if (mascota == null) {
            return null;
        }

        LocalDateTime fechaHora = request.getFechaHora();
        if (fechaHora == null) {
            fechaHora = LocalDateTime.now();
        }

        ReporteModel reporte = new ReporteModel();
        reporte.setDescripcion(request.getDescripcion());
        reporte.setFechaHora(fechaHora);
        reporte.setMascotaId(request.getMascotaId());
        reporte.setMascotaNombre(mascota.getNombre());
        return repository.save(reporte);
    }

    public Optional<ReporteModel> asignarUbicacion(Long reporteId, UbicacionModel ubicacion) {
        Optional<ReporteModel> existente = repository.findById(reporteId);
        if (existente.isEmpty()) {
            return Optional.empty();
        }

        UbicacionModel ubicacionGuardada = ubicacionService.guardar(ubicacion);
        ReporteModel reporte = existente.get();
        reporte.setUbicacion(ubicacionGuardada);
        repository.save(reporte);
        return Optional.of(reporte);
    }
}
