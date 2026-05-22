package Sanos_y_salvos.Fullstack_lll.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "reportes")
public class ReporteModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descripcion;

    private LocalDateTime fechaHora;

    private Long mascotaId;

    private String mascotaNombre;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "ubicacion_id")
    private UbicacionModel ubicacion;

    public ReporteModel() {
    }

    public ReporteModel(String descripcion, LocalDateTime fechaHora, Long mascotaId, String mascotaNombre) {
        this.descripcion = descripcion;
        this.fechaHora = fechaHora;
        this.mascotaId = mascotaId;
        this.mascotaNombre = mascotaNombre;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    public Long getMascotaId() {
        return mascotaId;
    }

    public void setMascotaId(Long mascotaId) {
        this.mascotaId = mascotaId;
    }

    public String getMascotaNombre() {
        return mascotaNombre;
    }

    public void setMascotaNombre(String mascotaNombre) {
        this.mascotaNombre = mascotaNombre;
    }

    public UbicacionModel getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(UbicacionModel ubicacion) {
        this.ubicacion = ubicacion;
    }
}
