package com.godream.api.controllers;

import com.godream.api.models.Lead;
import com.godream.api.models.Asesor;
import com.godream.api.repositories.LeadRepository;
import com.godream.api.repositories.AsesorRepository;
import com.godream.api.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leads")
// Mantenemos CrossOrigin por seguridad adicional, aunque ya tengas WebConfig
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class LeadController {

    @Autowired
    private LeadRepository repository;

    @Autowired
    private AsesorRepository asesorRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping
    public List<Lead> listarTodos() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<Lead> guardar(@RequestBody Lead lead) {
        try {
            // 1. Valores por defecto
            if (lead.getEstado() == null) lead.setEstado("NUEVO");
            if (lead.getOrigen() == null) lead.setOrigen("Web");

            // 2. Guardamos en la base de datos PRIMERO
            Lead nuevoLead = repository.save(lead);

            // 3. Intento de envío de correo (No bloqueante)
            try {
                if (emailService != null && nuevoLead.getEmail() != null) {
                    emailService.enviarConfirmacion(
                            nuevoLead.getEmail(),
                            nuevoLead.getNombre(),
                            nuevoLead.getPlan(),
                            nuevoLead.getEstrato()
                    );
                    System.out.println("✅ Correo enviado con éxito a: " + nuevoLead.getEmail());
                }
            } catch (Exception e) {
                // Si falla el correo, solo avisamos en consola, el Lead ya está a salvo en la DB
                System.err.println("⚠️ El Lead se guardó, pero el correo falló: " + e.getMessage());
            }

            return ResponseEntity.ok(nuevoLead);

        } catch (Exception e) {
            // Si el error ocurre AQUÍ, es un problema de la Base de Datos
            System.err.println("❌ Error crítico al guardar Lead: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Lead> actualizarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return repository.findById(id).map(lead -> {
            lead.setEstado(body.get("estado"));
            return ResponseEntity.ok(repository.save(lead));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/notas")
    public ResponseEntity<Lead> actualizarNotas(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return repository.findById(id).map(lead -> {
            lead.setNotas(body.get("notas"));
            return ResponseEntity.ok(repository.save(lead));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/asignar")
    public ResponseEntity<Lead> asignarAsesor(@PathVariable Long id, @RequestBody Map<String, Long> body) {
        if (!body.containsKey("asesorId")) return ResponseEntity.badRequest().build();

        Long asesorId = body.get("asesorId");
        return repository.findById(id).flatMap(lead ->
                asesorRepository.findById(asesorId).map(asesor -> {
                    lead.setAsesor(asesor);
                    return ResponseEntity.ok(repository.save(lead));
                })
        ).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarLead(@PathVariable Long id) {
        return repository.findById(id).map(lead -> {
            repository.delete(lead);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}