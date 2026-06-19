package usuario.usuario.service;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import usuario.usuario.model.UserModel;
import usuario.usuario.repository.UserRepository;

import java.util.List;

@SpringBootTest
@ActiveProfiles("test")
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {

        userRepository.deleteAll();
    }

    @Test
    void debeGuardarYBuscarUnUsuario() {
        UserModel nuevoUsuario = new UserModel(null, "test@correo.com", "password123", "Juan Perez");

        UserModel usuarioGuardado = userService.guardar(nuevoUsuario);

        assertNotNull(usuarioGuardado.getId(), "El ID no debería ser null tras guardar");
        assertEquals("test@correo.com", usuarioGuardado.getCorreo());

        UserModel usuarioEncontrado = userService.encontrarPorId(usuarioGuardado.getId());
        assertNotNull(usuarioEncontrado);
        assertEquals("Juan Perez", usuarioEncontrado.getNombres());
    }

    @Test
    void debeListarTodosLosUsuarios() {
        userService.guardar(new UserModel(null, "user1@correo.com", "pass1", "User Uno"));
        userService.guardar(new UserModel(null, "user2@correo.com", "pass2", "User Dos"));

        List<UserModel> usuarios = userService.listar();

        assertEquals(2, usuarios.size(), "Debería haber exactamente 2 usuarios en la lista");
    }

    @Test
    void debeRetornarNullSiElUsuarioNoExiste() {
        UserModel usuarioInexistente = userService.encontrarPorId(999);
        assertNull(usuarioInexistente, "Debería retornar null para un ID que no existe");
    }

    @Test
    void debeEliminarUnUsuario() {
        UserModel usuario = userService.guardar(new UserModel(null, "delete@correo.com", "pass", "A Eliminar"));
        Integer id = usuario.getId();

        userService.eliminar(id);

        UserModel usuarioEliminado = userService.encontrarPorId(id);
        assertNull(usuarioEliminado, "El usuario debería haber sido eliminado con éxito");
    }
}