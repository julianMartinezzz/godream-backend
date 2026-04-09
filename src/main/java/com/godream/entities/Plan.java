package com.godream.entities;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "planes")
public class Plan extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @NotBlank(message = "El nombre del plan no puede estar vacío")
    @Column(length = 100)
    public String nombre;

    @NotNull(message = "La velocidad es obligatoria")
    @Positive(message = "La velocidad debe ser un número positivo")
    public Integer velocidad;

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser un número positivo")
    public Double precio;

    @NotBlank(message = "Debe especificar el rango de estrato (ej: 1-3)")
    @Column(name = "estratoRango")
    public String estratoRango;

    @Column(columnDefinition = "TEXT")
    public String beneficios;

    // Constructor vacío requerido por Hibernate
    public Plan() {
    }

    // Constructor para facilitar pruebas manuales si lo necesitas
    public Plan(String nombre, Integer velocidad, Double precio, String estratoRango, String beneficios) {
        this.nombre = nombre;
        this.velocidad = velocidad;
        this.precio = precio;
        this.estratoRango = estratoRango;
        this.beneficios = beneficios;
    }
}