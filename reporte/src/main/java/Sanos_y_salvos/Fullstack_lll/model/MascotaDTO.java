package Sanos_y_salvos.Fullstack_lll.model;

public class MascotaDTO {

    private Long id;
    private String nombre;
    private String especie;
    private String raza;
    private String color_caracteristica;
    private String tamano;

    public MascotaDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEspecie() {
        return especie;
    }

    public void setEspecie(String especie) {
        this.especie = especie;
    }

    public String getRaza() {
        return raza;
    }

    public void setRaza(String raza) {
        this.raza = raza;
    }

    public String getColor_caracteristica() {
        return color_caracteristica;
    }

    public void setColor_caracteristica(String color_caracteristica) {
        this.color_caracteristica = color_caracteristica;
    }

    public String getTamano() {
        return tamano;
    }

    public void setTamano(String tamano) {
        this.tamano = tamano;
    }
}
