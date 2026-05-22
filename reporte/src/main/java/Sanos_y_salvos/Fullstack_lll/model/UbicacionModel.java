package Sanos_y_salvos.Fullstack_lll.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "ubicaciones")
public class UbicacionModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String direccion;
    private String ciudad;
    private String departamento;
    private String pais;
}
