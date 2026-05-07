package usuario.user.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data // Esto genera Getters, Setters, toString, etc.
@NoArgsConstructor // Genera el constructor vacío (Vital para MongoDB)
@AllArgsConstructor // Genera el constructor con todos los campos
@Document(collection = "usuarios")
public class User {
    @Id
    private String id;

    private String nombre;
    private String email;
    private String telefono;
    private String tipo;
    private String password;
}