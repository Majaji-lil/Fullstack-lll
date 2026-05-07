package usuario.user.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import usuario.user.model.User;
import usuario.user.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Nombre consistente con el controlador
    public User guardar(User user) {
        return userRepository.save(user);
    }

    public List<User> listar() {
        return userRepository.findAll();
    }

    public User encontrarporid(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public void eliminar(String id) {
        userRepository.deleteById(id);
    }
}