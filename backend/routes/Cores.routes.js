import { getColors, createColor, updateColor, deleteColor } from "../services/cores.service.js";

export default async function CoresRoutes(fastify) {
  // --- Esquemas de Documentação (Swagger) ---
  const getCoresSchema = {
    description: "Lista as cores disponíveis no sistema. Filtre por id, name ou hex (apenas um por vez)",
    tags: ["Cores"],
    querystring: {
      type: "object",
      properties: {
        id: { type: "number", examples: [1] },
        name: { type: "string", examples: ["Azul"] },
        hex: { type: "string", examples: ["#0000FF"] }
      }
    }
  };

  const postCoresSchema = {
    description: "Cria uma nova cor no sistema",
    tags: ["Cores"],
    body: {
      type: "object",
      required: ["name", "hex"],
      properties: {
        name: { type: "string", examples: ["Vermelho"] },
        hex: { type: "string", examples: ["#FF0000"] }
      }
    }
  };

  const putCoresSchema = {
    description: "Atualiza os dados de uma cor existente por ID",
    tags: ["Cores"],
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number", examples: [1] }
      }
    },
    body: {
      type: "object",
      required: ["name", "hex"],
      properties: {
        name: { type: "string", examples: ["Azul Escuro"] },
        hex: { type: "string", examples: ["#00008B"] }
      }
    }
  };

  const deleteCoresSchema = {
    description: "Remove uma cor do sistema por ID",
    tags: ["Cores"],
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "number", examples: [1] }
      }
    }
  };

    fastify.get("/cores", { schema: getCoresSchema }, async (request, reply) => {
        try {
            const query = request.query;

            if(query.id && (query.name || query.hex) || query.name && (query.id || query.hex) || query.hex && (query.id || query.name)) {
                return reply.err("Escolha apenas um parametro para buscar");
            }

            const cores = await getColors(query);
            if (!cores) return reply.err("Nenhuma cor encontrada");
            
            return reply.ok({data : cores})
        } catch (error) {
            console.error("Erro ao buscar cores:", error);
            reply.err(error);
        }
    });

    fastify.post("/cores", { schema: postCoresSchema }, async (request, reply) => {
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

    fastify.put("/cores/:id", { schema: putCoresSchema }, async (request, reply) => {
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

    fastify.delete("/cores/:id", { schema: deleteCoresSchema }, async (request, reply) => {
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