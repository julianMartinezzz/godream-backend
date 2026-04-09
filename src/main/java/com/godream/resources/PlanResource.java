package com.godream.resources;

import com.godream.entities.Plan;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/planes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PlanResource {

    @GET
    public List<Plan> listarTodos() {
        return Plan.listAll();
    }

    @POST
    @Transactional
    public Response crearPlan(Plan plan) {
        if (plan.nombre == null || plan.precio == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Datos incompletos").build();
        }
        plan.persist();
        return Response.status(Response.Status.CREATED).entity(plan).build();
    }
}