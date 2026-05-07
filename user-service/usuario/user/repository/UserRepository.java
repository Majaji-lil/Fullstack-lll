package usuario.user.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import usuario.user.model.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    // Spring Data MongoDB implementa esto automáticamente
    User findByEmail(String email);
}