package Reporte.reporte.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO puro — sin anotaciones JPA (@Entity, @Column, @Id)
// Solo sirve para recibir la respuesta del microservicio de mascotas
@AllArgsConstructor
@NoArgsConstructor
@Data
public class MascotaDTO {

    private Long id;
    private String nombre;
    private String especie;
    private String raza;
    private String color_caracteristica;
    private String tamano;
}