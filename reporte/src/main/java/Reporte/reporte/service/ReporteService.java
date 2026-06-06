package Reporte.reporte.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import Reporte.reporte.model.ReporteModel;
import Reporte.reporte.model.ReporteRequest;
import Reporte.reporte.model.UbicacionModel;
import Reporte.reporte.repository.ReporteRepository;

@Service
public class ReporteService {

    private final ReporteRepository repository;
    private final MascotaService mascotaService;
    private final UbicacionService ubicacionService;

    public ReporteService(ReporteRepository repository, MascotaService mascotaService,
            UbicacionService ubicacionService) {
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
        reporte.setMascotaId(mascota.getId());
        reporte.setMascotaNombre(mascota.getNombre());

        if (request.getUbicacionId() != null) {
            ubicacionService.encontrarPorId(request.getUbicacionId())
                    .ifPresent(reporte::setUbicacion);
        }

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
