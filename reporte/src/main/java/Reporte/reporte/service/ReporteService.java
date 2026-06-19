package Reporte.reporte.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import Reporte.reporte.model.ReporteModel;
import Reporte.reporte.model.ReporteRequest;
import Reporte.reporte.repository.ReporteRepository;

@Service
public class ReporteService {

    private final UsuarioService usuarioService;
    private final ReporteRepository repository;
    private final MascotaService mascotaService;

    public ReporteService(ReporteRepository repository, MascotaService mascotaService, UsuarioService usuarioService) {
        this.repository = repository;
        this.mascotaService = mascotaService;
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
        reporte.setLongitud(request.getLongitud());
        reporte.setLatitud(request.getLatitud());

        if (request.getUsuarioId() != null) {
            var usuario = usuarioService.obtenerUsuarioPorId(request.getUsuarioId());
            if (usuario != null) {
                reporte.setUsuarioId(usuario.getId());
                reporte.setUsuarioNombre(usuario.getNombres());
            }
        }
        return repository.save(reporte);
    }

    
}