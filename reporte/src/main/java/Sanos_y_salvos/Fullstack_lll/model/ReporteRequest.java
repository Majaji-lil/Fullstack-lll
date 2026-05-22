package Sanos_y_salvos.Fullstack_lll.model;

import java.time.LocalDateTime;

public class ReporteRequest {

    private String descripcion;
    private LocalDateTime fechaHora;
    private Long mascotaId;

    public ReporteRequest() {
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
}
