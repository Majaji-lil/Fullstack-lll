package Sanos_y_salvos.Fullstack_lll.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Mascotas")
public class MascotaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)


    private long id;

    private String nombre;
    private String especie;
    private String raza;
    private String color_caracteristica;
    private String tamanio;


    public MascotaModel() {}

    public Long getId () { return id; }


    public String getNombre() {return nombre;}
    public void setNombre(String nombre) {this.nombre = nombre;}

    public String getEspecie() {return especie;}
    public void setEspecie(String especie) {this.especie = especie;}

    public String getRaza() {return raza;}
    public void setRaza(String raza) {this.raza = raza;}

    public String getColor_caracteristica() {return color_caracteristica;}
    public void setColor_caracteristica(String color_caracteristica) {this.color_caracteristica = color_caracteristica;}

    public String getTamanio() {return tamanio;}
    public void setTamanio(String tamaño) {this.tamanio = tamanio;}

}
