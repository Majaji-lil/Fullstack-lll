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
@ActiveProfiles("test") // Usa una configuración aislada si la tienes, si no, igual levantará con Spring
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        // Limpiamos la base de datos antes de cada test para asegurar un entorno limpio
        userRepository.deleteAll();
    }

    @Test
    void debeGuardarYBuscarUnUsuario() {
        // 1. GIVEN (Dado un usuario nuevo)
        UserModel nuevoUsuario = new UserModel(null, "test@correo.com", "password123", "Juan Perez");

        // 2. WHEN (Cuando lo guardamos a través del servicio)
        UserModel usuarioGuardado = userService.guardar(nuevoUsuario);

        // 3. THEN (Entonces verificamos que se haya generado un ID y los datos
        // coincidan)
        assertNotNull(usuarioGuardado.getId(), "El ID no debería ser null tras guardar");
        assertEquals("test@correo.com", usuarioGuardado.getCorreo());

        // Comprobamos que podemos recuperarlo por ID
        UserModel usuarioEncontrado = userService.encontrarPorId(usuarioGuardado.getId());
        assertNotNull(usuarioEncontrado);
        assertEquals("Juan Perez", usuarioEncontrado.getNombres());
    }

    @Test
    void debeListarTodosLosUsuarios() {
        // 1. GIVEN (Dados dos usuarios guardados)
        userService.guardar(new UserModel(null, "user1@correo.com", "pass1", "User Uno"));
        userService.guardar(new UserModel(null, "user2@correo.com", "pass2", "User Dos"));

        // 2. WHEN (Cuando listamos)
        List<UserModel> usuarios = userService.listar();

        // 3. THEN (Entonces la lista debe contener 2 registros)
        assertEquals(2, usuarios.size(), "Debería haber exactamente 2 usuarios en la lista");
    }

    @Test
    void debeRetornarNullSiElUsuarioNoExiste() {
        // WHEN & THEN (Al buscar un ID inexistente como el 999, debe retornar null)
        UserModel usuarioInexistente = userService.encontrarPorId(999);
        assertNull(usuarioInexistente, "Debería retornar null para un ID que no existe");
    }

    @Test
    void debeEliminarUnUsuario() {
        // 1. GIVEN (Dado un usuario guardado)
        UserModel usuario = userService.guardar(new UserModel(null, "delete@correo.com", "pass", "A Eliminar"));
        Integer id = usuario.getId();

        // 2. WHEN (Cuando lo eliminamos)
        userService.eliminar(id);

        // 3. THEN (Entonces al buscarlo ya no debe existir)
        UserModel usuarioEliminado = userService.encontrarPorId(id);
        assertNull(usuarioEliminado, "El usuario debería haber sido eliminado con éxito");
    }
}