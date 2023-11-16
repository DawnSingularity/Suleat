import { Flavor, Post, Prisma } from "prisma/prisma-client"

// firstName   String  @default("")
//     lastName    String  @default("")
//     userName    String  @unique
//     pfpURL      String  @default("https://picsum.photos/500/500")

const userWithFlavors = Prisma.validator<Prisma.UserDefaultArgs>()({
    include: { flavors: true },
  })
  
  type UserWithFlavors = Prisma.UserGetPayload<typeof userWithFlavors>

export function UserComponent({ user }: { user: UserWithFlavors }) {
}
