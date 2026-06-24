package Reporte.reporte.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "reportes")
public class ReporteModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    private Long usuarioId;

    @Column(nullable = true)
    private String usuarioNombre;

    @Column(nullable = false)
    private String descripcion;

    @Column(nullable = true)
    private LocalDateTime fechaHora;

    @Column(nullable = false)
    private Long mascotaId;

    @Column(nullable = false)
    private String mascotaNombre;

    @Column(nullable = false)
    private Double longitud;

    @Column(nullable = false)
    private Double latitud;

    public ReporteModel(String descripcion, LocalDateTime fechaHora, Long mascotaId, String mascotaNombre) {
        this.descripcion = descripcion;
        this.fechaHora = fechaHora;
        this.mascotaId = mascotaId;
        this.mascotaNombre = mascotaNombre;
    }
}
