package com.godream.resources;

import com.godream.entities.Lead; // Asegúrate de tener esta entidad
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/leads")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class LeadResource {

    @POST
    @Transactional
    public Response crearLead(Lead lead) {
        if (lead.nombre == null || lead.celular == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Información de contacto incompleta").build();
        }
        lead.persist();
        return Response.status(Response.Status.CREATED).entity(lead).build();
    }

    @GET
    public List<Lead> listarLeads() {
        return Lead.listAll();
    }
}