import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import {z} from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function getAttendeeBadge(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get(
        "/attendees/:attendeeId/badge",
        {
            schema:{
                params: z.object({
                    attendeeId: z.coerce.number().int(),
                }),
                response:{
                    200: z.object({
                        badge: z.object({
                            name: z.string(),
                            email: z.string().email(),
                            title: z.string(),
                            URL: z.string().url(),
                        }),
                    }),
                }
            }
        },
        async (request,reply) => {
            const { attendeeId } = request.params;

            const attendee = await prisma.attendee.findUnique({
                select: {
                    name: true,
                    email: true,
                    event: {
                        select: {
                            title: true
                        }
                    }
                },
                where: {
                    id: attendeeId
                }
            });

            if (attendee === null) {
                throw new BadRequest("Attendee Not Found.");
            }

            const baseURL = `${request.protocol}://${request.hostname}`;
            
            const CheckInURL = new URL(`/atttendees/${attendeeId}/checkin`, baseURL);  

            return reply.send({
                badge: {
                    name: attendee.name,
                    email: attendee.email,
                    title: attendee.event.title,
                    URL: CheckInURL.toString(),
                },
            });

        }
    );
}