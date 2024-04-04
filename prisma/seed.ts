import { prisma } from "../src/lib/prisma";

async function seed() {
    await prisma.event.create({
        data:{
            id: "00f5f90e-a582-40fa-8e0e-a336df970f3d",
            title: "Unite Summit",
            slug: "unite-summit",
            detais: "Um evento para devs apaixonados",
            maximumAttendees: 120,
        }
    });
}

seed().then(() => {
    console.log("Database seeded");
    prisma.$disconnect();
});