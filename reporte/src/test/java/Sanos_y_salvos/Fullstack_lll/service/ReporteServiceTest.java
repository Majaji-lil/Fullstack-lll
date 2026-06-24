package Sanos_y_salvos.Fullstack_lll.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.junit.jupiter.MockitoExtension;

import Reporte.reporte.model.MascotaDTO;
import Reporte.reporte.model.ReporteModel;
import Reporte.reporte.model.ReporteRequest;
import Reporte.reporte.model.UsuarioDTO;
import Reporte.reporte.repository.ReporteRepository;
import Reporte.reporte.service.MascotaService;
import Reporte.reporte.service.ReporteService;
import Reporte.reporte.service.UsuarioService;

@ExtendWith(MockitoExtension.class)
public class ReporteServiceTest {

    @Mock
    private ReporteRepository repository;

    @Mock
    private MascotaService mascotaService;

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private ReporteService service;

    @Test
    public void testGuardarReporte() {
        // Arrange
        ReporteRequest request = new ReporteRequest();
        request.setDescripcion("Mascota vista en el parque");
        request.setMascotaId(1L);
        request.setUsuarioId(1L);
        request.setLatitud(-33.4489);
        request.setLongitud(-70.6693);

        MascotaDTO mascota = new MascotaDTO();
        mascota.setId(1L);
        mascota.setNombre("Firulais");

        UsuarioDTO usuario = new UsuarioDTO();
        usuario.setId(1);
        usuario.setNombres("Juan Pérez");

        ReporteModel reporteGuardado = new ReporteModel();
        reporteGuardado.setId(1L);
        reporteGuardado.setDescripcion("Mascota vista en el parque");
        reporteGuardado.setMascotaId(1L);
        reporteGuardado.setMascotaNombre("Firulais");
        reporteGuardado.setUsuarioId(1);
        reporteGuardado.setUsuarioNombre("Juan Pérez");
        reporteGuardado.setLatitud(-33.4489);
        reporteGuardado.setLongitud(-70.6693);

        when(mascotaService.obtenerMascotaPorId(1L)).thenReturn(mascota);
        when(usuarioService.obtenerUsuarioPorId(1L)).thenReturn(usuario);
        when(repository.save(any(ReporteModel.class))).thenReturn(reporteGuardado);

        // Act
        ReporteModel resultado = service.guardar(request);

        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Mascota vista en el parque", resultado.getDescripcion());
        assertEquals("Firulais", resultado.getMascotaNombre());
        assertEquals("Juan Pérez", resultado.getUsuarioNombre());
    }

    @Test
    public void testGuardarReporteSinMascota() {
        // Arrange
        ReporteRequest request = new ReporteRequest();
        request.setDescripcion("Test");
        request.setMascotaId(1L);

        when(mascotaService.obtenerMascotaPorId(1L)).thenReturn(null);

        // Act
        ReporteModel resultado = service.guardar(request);

        // Assert
        assertNull(resultado);
    }

    @Test
    public void testGuardarReporteRequestNulo() {
        // Act
        ReporteModel resultado = service.guardar(null);

        // Assert
        assertNull(resultado);
    }

    @Test
    public void testListarReportes() {
        // Arrange
        ReporteModel r1 = new ReporteModel();
        r1.setId(1L);
        r1.setDescripcion("Reporte 1");

        ReporteModel r2 = new ReporteModel();
        r2.setId(2L);
        r2.setDescripcion("Reporte 2");

        when(repository.findAll()).thenReturn(Arrays.asList(r1, r2));

        // Act
        List<ReporteModel> resultado = service.listar();

        // Assert
        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertEquals("Reporte 1", resultado.get(0).getDescripcion());
        assertEquals("Reporte 2", resultado.get(1).getDescripcion());
    }

    @Test
    public void testObtenerReporteExistente() {
        // Arrange
        ReporteModel reporte = new ReporteModel();
        reporte.setId(1L);
        reporte.setDescripcion("Mascota perdida");

        when(repository.findById(1L)).thenReturn(Optional.of(reporte));

        // Act
        Optional<ReporteModel> resultado = service.obtener(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(true, resultado.isPresent());
        assertEquals("Mascota perdida", resultado.get().getDescripcion());
    }

    @Test
    public void testObtenerReporteNoExistente() {
        // Arrange
        when(repository.findById(99L)).thenReturn(Optional.empty());

        // Act
        Optional<ReporteModel> resultado = service.obtener(99L);

        // Assert
        assertEquals(false, resultado.isPresent());
    }

    @Test
    public void testGuardarReporteFechaAutoAsignada() {
        // Arrange
        ReporteRequest request = new ReporteRequest();
        request.setDescripcion("Sin fecha");
        request.setMascotaId(1L);
        request.setFechaHora(null);

        MascotaDTO mascota = new MascotaDTO();
        mascota.setId(1L);
        mascota.setNombre("Firulais");

        when(mascotaService.obtenerMascotaPorId(1L)).thenReturn(mascota);
        when(repository.save(any(ReporteModel.class))).thenAnswer(inv -> {
            ReporteModel r = inv.getArgument(0);
            r.setId(1L);
            return r;
        });

        // Act
        ReporteModel resultado = service.guardar(request);

        // Assert
        assertNotNull(resultado);
        assertNotNull(resultado.getFechaHora());
    }
}
