package usuario.usuario.service;

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

import usuario.usuario.model.UserModel;
import usuario.usuario.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService service;

    @Test
    public void testGuardarUsuario() {
        // Arrange
        UserModel usuario = new UserModel();
        usuario.setCorreo("test@correo.com");
        usuario.setPassword("password123");
        usuario.setNombres("Juan Perez");

        UserModel usuarioGuardado = new UserModel();
        usuarioGuardado.setId(1);
        usuarioGuardado.setCorreo("test@correo.com");
        usuarioGuardado.setPassword("password123");
        usuarioGuardado.setNombres("Juan Perez");

        when(userRepository.save(usuario)).thenReturn(usuarioGuardado);

        // Act
        UserModel resultado = service.guardar(usuario);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.getId());
        assertEquals("test@correo.com", resultado.getCorreo());
        assertEquals("Juan Perez", resultado.getNombres());
    }

    @Test
    public void testListarUsuarios() {
        // Arrange
        UserModel u1 = new UserModel();
        u1.setId(1);
        u1.setNombres("User Uno");

        UserModel u2 = new UserModel();
        u2.setId(2);
        u2.setNombres("User Dos");

        when(userRepository.findAll()).thenReturn(Arrays.asList(u1, u2));

        // Act
        List<UserModel> resultado = service.listar();

        // Assert
        assertNotNull(resultado);
        assertEquals(2, resultado.size());
        assertEquals("User Uno", resultado.get(0).getNombres());
        assertEquals("User Dos", resultado.get(1).getNombres());
    }

    @Test
    public void testEncontrarPorIdExistente() {
        // Arrange
        UserModel usuario = new UserModel();
        usuario.setId(1);
        usuario.setNombres("Juan Perez");

        when(userRepository.findById(1)).thenReturn(Optional.of(usuario));

        // Act
        UserModel resultado = service.encontrarPorId(1);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.getId());
        assertEquals("Juan Perez", resultado.getNombres());
    }

    @Test
    public void testEncontrarPorIdNoExistente() {
        // Arrange
        when(userRepository.findById(999)).thenReturn(Optional.empty());

        // Act
        UserModel resultado = service.encontrarPorId(999);

        // Assert
        assertNull(resultado);
    }

    @Test
    public void testEliminarUsuario() {
        // Act
        service.eliminar(1);

        // Assert
        verify(userRepository, times(1)).deleteById(1);
    }
}