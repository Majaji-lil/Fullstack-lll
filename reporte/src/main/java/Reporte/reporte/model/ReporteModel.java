package Reporte.reporte.model;

import java.time.LocalDateTime;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
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
    private Integer usuarioId;

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

@OneToOne(cascade = CascadeType.ALL)
@JoinColumn(name = "ubicacion_id", nullable = true)
private UbicacionModel ubicacion; 

    public ReporteModel(String descripcion, LocalDateTime fechaHora, Long mascotaId, String mascotaNombre) {
        this.descripcion = descripcion;
        this.fechaHora = fechaHora;
        this.mascotaId = mascotaId;
        this.mascotaNombre = mascotaNombre;
    }
}
