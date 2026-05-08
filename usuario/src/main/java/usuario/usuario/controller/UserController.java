package usuario.usuario.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    
    @PostMapping
    public UserModel crear(@RequestBody UserModel user) {
        return userService.guardar(user);
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        userService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}