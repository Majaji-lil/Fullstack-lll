package Sanos_y_salvos.Fullstack_lll.service;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
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
        mascota.setColor_caracteristica("Amarillo");
        mascota.setTamano("Grande");

        MascotaModel mascotaGuardada = new MascotaModel();
        mascotaGuardada.setId(1L);
        mascotaGuardada.setNombre("Firulais");
        mascotaGuardada.setEspecie("Perro");
        mascotaGuardada.setRaza("Labrador");
        mascotaGuardada.setColor_caracteristica("Amarillo");
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
        assertEquals("Amarillo", resultado.getColor_caracteristica());
        assertEquals("Grande", resultado.getTamano());
    }
}
