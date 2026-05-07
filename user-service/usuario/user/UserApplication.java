package usuario.user;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UserApplication {
	public static void main(String[] args) {
		// Esto fuerza a la aplicación a leer la URI antes de arrancar
		System.setProperty("spring.data.mongodb.uri",
				"mongodb+srv://emsanchezg_db_user:sys1234@clustersys.jb8klue.mongodb.net/sanos_y_salvos_db?retryWrites=true&w=majority&appName=ClusterSYS");
		SpringApplication.run(UserApplication.class, args);
	}
}
