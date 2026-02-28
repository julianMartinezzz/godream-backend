package com.godream.api.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String telefono;

    private String plan;
    private String estrato;
    private String estado = "NUEVO";
    private String origen = "Web";

    @Column(columnDefinition = "TEXT")
    private String notas;

    // --- RELACIÓN CON ASESOR (OPCIONAL) ---
    // many-to-one: muchos leads pueden pertenecer a un mismo asesor
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "asesor_id", nullable = true)
    private Asesor asesor;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    // --- CONSTRUCTORES ---
    public Lead() {}

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        if (this.estado == null) this.estado = "NUEVO";
        if (this.origen == null) this.origen = "Web";
    }

    // --- GETTERS Y SETTERS ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getPlan() { return plan; }
    public void setPlan(String plan) { this.plan = plan; }

    public String getEstrato() { return estrato; }
    public void setEstrato(String estrato) { this.estrato = estrato; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getOrigen() { return origen; }
    public void setOrigen(String origen) { this.origen = origen; }

    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }

    public Asesor getAsesor() { return asesor; }
    public void setAsesor(Asesor asesor) { this.asesor = asesor; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}