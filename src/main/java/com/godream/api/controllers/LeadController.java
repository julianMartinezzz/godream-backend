package com.godream.api.controllers;

import com.godream.api.models.Lead;
import com.godream.api.models.Asesor;
import com.godream.api.repositories.LeadRepository;
import com.godream.api.repositories.AsesorRepository;
import com.godream.api.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leads")
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
            if (lead.getEstado() == null) lead.setEstado("NUEVO");
            if (lead.getOrigen() == null) lead.setOrigen("Web");

            Lead nuevoLead = repository.save(lead);

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
                System.err.println("⚠️ El Lead se guardó, pero el correo falló: " + e.getMessage());
            }

            return ResponseEntity.ok(nuevoLead);

        } catch (Exception e) {
            System.err.println("❌ Error crítico al guardar Lead: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    // MÉTODO ACTUALIZADO: Maneja la fecha de instalación para el cierre de caja mensual
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Lead> actualizarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return repository.findById(id).map(lead -> {
            String nuevoEstado = body.get("estado");
            lead.setEstado(nuevoEstado);

            // Si el estado es INSTALADA, grabamos el momento exacto
            if ("INSTALADA".equalsIgnoreCase(nuevoEstado)) {
                lead.setFechaInstalacion(LocalDateTime.now());
            } else {
                // Si cambia a otro estado, eliminamos la fecha para que no sume en la liquidación mensual
                lead.setFechaInstalacion(null);
            }

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