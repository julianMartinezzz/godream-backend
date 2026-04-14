package com.godream.entities;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

@Entity
public class Lead extends PanacheEntity {
    public String nombre;
    public String email;
    public String celular;
    public String planInteres;
}