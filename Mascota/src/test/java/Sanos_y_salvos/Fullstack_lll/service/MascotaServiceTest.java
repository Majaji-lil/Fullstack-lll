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
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import Sanos_y_salvos.Fullstack_lll.model.MascotaModel;
import Sanos_y_salvos.Fullstack_lll.repository.MascotaRepository;

@ExtendWith(MockitoExtension.class)
public class MascotaServiceTest {

    @Mock
    private MascotaRepository repository;

    @InjectMocks
    private MascotaService service;

    @Test
    public void testGuardarMascota() {
        // Arrange
        MascotaModel mascota = new MascotaModel();
        mascota.setNombre("Firulais");
        mascota.setEspecie("Perro");
        mascota.setRaza("Labrador");
        mascota.setColorCaracteristica("Amarillo");
        mascota.setTamano("Grande");

        MascotaModel mascotaGuardada = new MascotaModel();
        mascotaGuardada.setId(1L);
        mascotaGuardada.setNombre("Firulais");
        mascotaGuardada.setEspecie("Perro");
        mascotaGuardada.setRaza("Labrador");
        mascotaGuardada.setColorCaracteristica("Amarillo");
        mascotaGuardada.setTamano("Grande");

        when(repository.save(mascota)).thenReturn(mascotaGuardada);

        // Act
        MascotaModel resultado = service.guardar(mascota);

        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Firulais", resultado.getNombre());
        assertEquals("Perro", resultado.getEspecie());
        assertEquals("Labrador", resultado.getRaza());
        assertEquals("Amarillo", resultado.getColorCaracteristica());
        assertEquals("Grande", resultado.getTamano());
    }

    @Test
    public void testListarMascotas() {
        // Arrange
        MascotaModel mascota1 = new MascotaModel();
        mascota1.setId(1L);
        mascota1.setNombre("Firulais");

        MascotaModel mascota2 = new MascotaModel();
        mascota2.setId(2L);
        mascota2.setNombre("Luna");

        when(repository.findAll()).thenReturn(Arrays.asList(mascota1, mascota2));

        // Act
        List<MascotaModel> resultado = service.listar();

        // Assert
        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertEquals("Firulais", resultado.get(0).getNombre());
        assertEquals("Luna", resultado.get(1).getNombre());
    }

    @Test
    public void testEncontrarPorIdExistente() {
        // Arrange
        MascotaModel mascota = new MascotaModel();
        mascota.setId(1L);
        mascota.setNombre("Firulais");

        when(repository.findById(1L)).thenReturn(Optional.of(mascota));

        // Act
        MascotaModel resultado = service.encontrarporid(1L);

        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("Firulais", resultado.getNombre());
    }

    @Test
    public void testEncontrarPorIdNoExistente() {
        // Arrange
        when(repository.findById(99L)).thenReturn(Optional.empty());

        // Act
        MascotaModel resultado = service.encontrarporid(99L);

        // Assert
        assertNull(resultado);
    }

    @Test
    public void testActualizarMascotaExistente() {
        // Arrange
        MascotaModel mascotaExistente = new MascotaModel();
        mascotaExistente.setId(1L);
        mascotaExistente.setNombre("Firulais");
        mascotaExistente.setEspecie("Perro");
        mascotaExistente.setRaza("Labrador");
        mascotaExistente.setColorCaracteristica("Amarillo");
        mascotaExistente.setTamano("Grande");

        MascotaModel datosNuevos = new MascotaModel();
        datosNuevos.setNombre("Firulais Actualizado");
        datosNuevos.setEspecie("Perro");
        datosNuevos.setRaza("Poodle");
        datosNuevos.setColorCaracteristica("Blanco");
        datosNuevos.setTamano("Pequeño");

        when(repository.findById(1L)).thenReturn(Optional.of(mascotaExistente));
        when(repository.save(mascotaExistente)).thenReturn(mascotaExistente);

        // Act
        MascotaModel resultado = service.actualizar(1L, datosNuevos);

        // Assert
        assertNotNull(resultado);
        assertEquals("Firulais Actualizado", resultado.getNombre());
        assertEquals("Poodle", resultado.getRaza());
        assertEquals("Blanco", resultado.getColorCaracteristica());
        assertEquals("Pequeño", resultado.getTamano());
    }

    @Test
    public void testActualizarMascotaNoExistente() {
        // Arrange
        MascotaModel datosNuevos = new MascotaModel();
        datosNuevos.setNombre("No existe");

        when(repository.findById(99L)).thenReturn(Optional.empty());

        // Act
        MascotaModel resultado = service.actualizar(99L, datosNuevos);

        // Assert
        assertNull(resultado);
    }

    @Test
    public void testEliminarMascota() {
        // Act
        service.eliminar(1L);

        // Assert
        verify(repository, times(1)).deleteById(1L);
    }
}
