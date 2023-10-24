import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const sweet = await prisma.flavor.upsert({
        where: { id: 1 }, 
        update: {},
        create: {
            id: 1,
            name: "sweet",
            color: "#FFABF8",
            userId: 1
        }
    })

    const sour = await prisma.flavor.upsert({
        where: { id: 2 }, 
        update: {},
        create: {
            id: 2,
            name: "sour",
            color: "#9DE02E",
            userId: 1
        }
    })

    const spicy = await prisma.flavor.upsert({
        where: { id: 3 }, 
        update: {},
        create: {
            id: 3,
            name: "spicy",
            color: "#E0472E",
            userId: 1
        }
    })

    const umami = await prisma.flavor.upsert({
        where: { id: 4 }, 
        update: {},
        create: {
            id: 4,
            name: "umami",
            color: "#1CEBE0",
            userId: 1
        }
    })

    const bitter = await prisma.flavor.upsert({
        where: { id: 5 }, 
        update: {},
        create: {
            id: 5,
            name: "bitter",
            color: "#C6B887",
            userId: 1
        }
    })

    const gordon_ramsay = await prisma.user.upsert({
        where: { id: 1},
        update: {},
        create: {
            id: 1,
            bio: "Renowned chef & TV personality with a passion for culinary excellence. Known for my fiery persona in the kitchen and commitment to exquisite flavors. Join me on a journey of taste and gastronomic exploration. #CookingWithPassion 🍽️",
            firstName: "Gordon",
            lastName: "Ramsay",
            userName: "gordonramsay",
            pfpURL: "https://picsum.photos/500/500",
            location: "Manila, Philippines",
            coverURL: 'https://picsum.photos/600/600'
        }
    })
}




main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })