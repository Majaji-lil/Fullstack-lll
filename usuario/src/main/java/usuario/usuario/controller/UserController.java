package usuario.usuario.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import usuario.usuario.model.UserModel;
import usuario.usuario.service.UserService;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<UserModel> listarTodos() {
        return userService.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserModel> obtenerPorId(@PathVariable Integer id) {
        UserModel user = userService.encontrarPorId(id);
        return (user != null) ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserModel credenciales) {
        UserModel usuarioValido = userService.autenticar(credenciales.getCorreo(), credenciales.getPassword());

        if (usuarioValido != null) {
            return ResponseEntity.ok(usuarioValido);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Correo o contraseña incorrectos");
        }
    }

    @PostMapping
    public UserModel crear(@RequestBody UserModel user) {
        return userService.guardar(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserModel> actualizar(@PathVariable Integer id, @RequestBody UserModel userDetails) {
        UserModel user = userService.encontrarPorId(id);
        if (user != null) {
            user.setCorreo(userDetails.getCorreo());
            user.setNombres(userDetails.getNombres());

            UserModel actualizado = userService.guardar(user);
            return ResponseEntity.ok(actualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        userService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}