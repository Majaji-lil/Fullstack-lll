package usuario.usuario.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import usuario.usuario.model.UserModel;
import usuario.usuario.repository.UserRepository;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserModel guardar(UserModel user) {
        return userRepository.save(user);
    }

    public List<UserModel> listar() {
        return userRepository.findAll();
    }

    public UserModel encontrarPorId(Integer id) {
        return userRepository.findById(id).orElse(null);
    }

    public void eliminar(Integer id) {
        userRepository.deleteById(id);
    }
}