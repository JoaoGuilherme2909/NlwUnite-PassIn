import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function GetEventAttendees(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/events/:eventId/attendees",
    {
      schema: {
        params: z.object({
          eventId: z.string().uuid(),
        }),
        querystring: z.object({
          pageIndex: z.string().nullable().default('0').transform(Number),
        }),
        response: {},
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;

      const { pageIndex } = request.query;

      const attendees = await prisma.attendee.findMany({
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
        where: {
          eventId,
        },
        take: 10,
        skip: pageIndex * 10
      });

      if (attendees === null) {
        throw new Error("Nenhum participante encontrado");
      }

      return reply.status(200).send({attendees});
    }
  );
}
