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
<<<<<<< HEAD
    private String tamanio;
=======
    private String tamano;
>>>>>>> 2d4fc8e03c4d9f49b74af8791825656b584bc3ac


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

<<<<<<< HEAD
    public String getTamanio() {return tamanio;}
    public void setTamanio(String tamaño) {this.tamanio = tamanio;}
=======
    public String getTamano() {return tamano;}
    public void setTamano(String tamano) {this.tamano = tamano;}
>>>>>>> 2d4fc8e03c4d9f49b74af8791825656b584bc3ac

}
