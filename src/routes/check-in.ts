import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function CheckIn(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/attendees/:attendeeId/checkin",
    {
      schema: {
        params: z.object({
          attendeeId: z.coerce.number().int(),
        }),
        response:{
          200: z.null(),
        } 
      },
    },
    async (request, reply) => {
      const { attendeeId } = request.params;

      const CheckInAlreadyMade = await prisma.checkIn.findUnique({
        where: {
          attendeeId,
        },
      });

      if (CheckInAlreadyMade !== null) {
        throw new Error("Check already made");
      }

      await prisma.checkIn.create({
        data: {
          attendeeId,
        },
      });

      return reply.status(201).send();
    }
  );
}
