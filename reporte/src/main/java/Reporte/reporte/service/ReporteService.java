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

    private final UsuarioService usuarioService;
    private final ReporteRepository repository;
    private final MascotaService mascotaService;
    private final UbicacionService ubicacionService;

    public ReporteService(ReporteRepository repository,
            MascotaService mascotaService,
            UbicacionService ubicacionService,
            UsuarioService usuarioService) {
        this.repository = repository;
        this.mascotaService = mascotaService;
        this.ubicacionService = ubicacionService;
        this.usuarioService = usuarioService;
    }

    public List<ReporteModel> listar() {
        return repository.findAll();
    }

    public Optional<ReporteModel> obtener(Long id) {
        return repository.findById(id);
    }

    public ReporteModel guardar(ReporteRequest request) {
        System.out.println("VERSION NUEVA DEL SERVICIO");
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

        if (request.getUsuarioId() != null) {
            var usuario = usuarioService.obtenerUsuarioPorId(request.getUsuarioId());
            if (usuario != null) {
                reporte.setUsuarioId(usuario.getId());
                reporte.setUsuarioNombre(usuario.getNombres());
            }
        }
        if (request.getUbicacionId() != null) {
            reporte.setUbicacion(ubicacionService.encontrarPorId(request.getUbicacionId()).orElse(null));
        }

        return repository.save(reporte);

    }

    public Optional<ReporteModel> editar(Long id, ReporteRequest request) {
        return repository.findById(id).map(reporteExistente -> {
            reporteExistente.setDescripcion(request.getDescripcion());

            if (request.getFechaHora() != null) {
                reporteExistente.setFechaHora(request.getFechaHora());
            }

            // Sincronizar datos si cambia la mascota asociada
            if (request.getMascotaId() != null) {
                var mascota = mascotaService.obtenerMascotaPorId(request.getMascotaId());
                if (mascota != null) {
                    reporteExistente.setMascotaId(mascota.getId());
                    reporteExistente.setMascotaNombre(mascota.getNombre());
                }
            }

            return repository.save(reporteExistente);
        });
    }

    public boolean eliminar(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
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