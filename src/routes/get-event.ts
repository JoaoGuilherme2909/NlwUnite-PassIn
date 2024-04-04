import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function getEvent(app : FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().get(
        "/events/:eventId", 
        {
            schema: {
                params: z.object({
                    eventId: z.string().uuid()
                }),
                response: {
                    200: z.object({
                        id: z.string().uuid(),
                        title: z.string(),
                        detais: z.string().nullable(),
                        slug: z.string(),
                        maximumAttendees:z.number().nullable(),
                        attendeesCount: z.number().int(),
                    }),

                }
            }
        }, 
        async (request, reply) => {
            const { eventId } = request.params;

            const event = await prisma.event.findUnique({
                select: {
                    id: true,
                    title: true,
                    detais: true,
                    slug: true,
                    maximumAttendees: true,
                    _count: {
                        select: {
                            attendees: true,
                        }
                    }
                },
                where:{
                    id: eventId,
                }
            });

            if( event === null ){
                throw new BadRequest("Event Not Found.");
            }   

            return reply.status(200).send({
                id: event.id,
                title: event.title,
                detais: event.detais,
                slug: event.slug,
                maximumAttendees: event.maximumAttendees,
                attendeesCount: event._count.attendees,
            })

        }
    )
} 