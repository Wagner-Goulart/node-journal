import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import { z } from "zod";

export async function memoriesRoutes(app: FastifyInstance) {
  app.get("/memories", async () => {
    let memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverurl,
        excerpty: memory.content.substring(0, 155).concat("..."),
      };
    });
  });

  app.get("/memories/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });
    const { id } = paramsSchema.parse(request.params);
    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    });

    return memory;
  });

  app.post("/memories", async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      coverurl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    });

    const { content, coverurl, isPublic } = bodySchema.parse(request.body);

    const memory = await prisma.memory.create({
      data: {
        content,
        coverurl,
        isPublic,
        userId: "6ccd5191-9cc2-4685-abd6-df344da3eed5",
      },
    });

    return memory;
  });

  app.put("/memories/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const bodySchema = z.object({
      content: z.string(),
      coverurl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    });

    const { content, coverurl, isPublic } = bodySchema.parse(request.body);

    const memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverurl,
        isPublic,
      },
    });

    return memory;
  });

  app.delete("/memories/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    await prisma.memory.delete({
      where: {
        id,
      },
    });
  });
}
