import { getColors, createColor, updateColor, deleteColor } from "../services/cores.service.js";

export default async function CoresRoutes(fastify, options) {
    fastify.get("/cores", async (request, reply) => {
        try {
            const query = request.query;

            if(query.id && (query.name || query.hex) || query.name && (query.id || query.hex) || query.hex && (query.id || query.name)) {
                return reply.err("Escolha apenas um parametro para buscar");
            }

            const cores = await getColors(query);
            if (!cores) return reply.err("Nenhuma cor encontrada");
            
            // Usamos `.send()` nativo para devolver a Array crua
            // pois o seu decorador `reply.ok()` transforma arrays em Objetos (Ex: { "0": {...}, "1": {...} })
            // return reply.send(cores);
            return reply.ok({data : cores})
        } catch (error) {
            console.error("Erro ao buscar cores:", error);
            reply.err(error);
        }
    });

    fastify.post("/cores", async (request, reply) => {
        try {

            const { name, hex } = request.body;

            if (!name || !hex) {
                return reply.err("Nome e Hex são obrigatórios - { name: string, hex: string }");
            }

            const color = await createColor({ name, hex });
            return reply.ok(color);
        } catch (error) {
            console.error("Erro ao criar cor:", error);
            reply.err(error);
        }
    });

    fastify.put("/cores/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const { name, hex } = request.body;

            if (!name || !hex) {
                return reply.err("Nome e Hex são obrigatórios - { name: string, hex: string }");
            }

            const color = await updateColor(id, { name, hex });
            return reply.ok(color);
        } catch (error) {
            console.error("Erro ao atualizar cor:", error);
            reply.err(error);
        }
    });

    fastify.delete("/cores/:id", async (request, reply) => {
        try {
            const { id } = request.params;

            if (!id) {
                return reply.err("ID é obrigatório - /cores/:id");
            }

            const color = await deleteColor(id);
            return reply.ok(color);
        } catch (error) {
            console.error("Erro ao deletar cor:", error);
            reply.err(error);
        }
    });
}