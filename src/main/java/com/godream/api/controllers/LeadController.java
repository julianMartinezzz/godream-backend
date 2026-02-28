package com.godream.api.controllers;

import com.godream.api.models.Lead;
import com.godream.api.repositories.LeadRepository;
import com.godream.api.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leads")
// Agregamos DELETE a los métodos permitidos
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class LeadController {

    @Autowired
    private LeadRepository repository;

    @Autowired
    private EmailService emailService;

    @GetMapping
    public List<Lead> listarTodos() {
        return repository.findAll();
    }

    @PostMapping
    public Lead guardar(@RequestBody Lead lead) {
        if (lead.getEstado() == null) lead.setEstado("NUEVO");
        Lead nuevoLead = repository.save(lead);

        try {
            emailService.enviarConfirmacion(
                    nuevoLead.getEmail(),
                    nuevoLead.getNombre(),
                    nuevoLead.getPlan(),
                    nuevoLead.getEstrato()
            );
            System.out.println("✅ Correo enviado con éxito a: " + nuevoLead.getEmail());
        } catch (Exception e) {
            System.err.println("❌ Error al enviar correo: " + e.getMessage());
        }

        return nuevoLead;
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Lead> actualizarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return repository.findById(id).map(lead -> {
            lead.setEstado(body.get("estado"));
            return ResponseEntity.ok(repository.save(lead));
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- NUEVO: ACTUALIZAR SOLO NOTAS ---
    @PatchMapping("/{id}/notas")
    public ResponseEntity<Lead> actualizarNotas(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return repository.findById(id).map(lead -> {
            lead.setNotas(body.get("notas"));
            return ResponseEntity.ok(repository.save(lead));
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- NUEVO: ELIMINAR LEAD ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarLead(@PathVariable Long id) {
        return repository.findById(id).map(lead -> {
            repository.delete(lead);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}