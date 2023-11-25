import Link from "next/link"
import { Flavor, Post, Prisma } from "prisma/prisma-client"
import { useAuth } from "@clerk/nextjs";
import { UserIcon } from "./user-icon"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faLocationDot  } from "@fortawesome/free-solid-svg-icons";
import { PillButton } from "../profile/pill-button" 

const userWithFlavors = Prisma.validator<Prisma.UserDefaultArgs>()({
    include: { flavors: true },
  })
  
  type UserWithFlavors = Prisma.UserGetPayload<typeof userWithFlavors>

export function UserComponent({ user }: { user: UserWithFlavors }) {
  const auth = useAuth();
  console.log("Flavors: " + user.flavors)

  return (
    <>
    <Link href={`/profile/${user.userName}`}>
      <div className="bg-white mb-3 p-4 rounded-lg drop-shadow-md">
        <div className=" flex flex-row items-center justify-between">
            <div className="order-first flex flex-row items-center">
                <UserIcon user={user} width="10" className="mr-3" />
                <div>
                    <div className="text-sm">{ user.firstName } { user.lastName }</div>
                    <div className="text-xs text-red-600">
                        <FontAwesomeIcon icon={faLocationDot} className="mr-1" style={{ color: 'red' }} />
                        { user.location }
                    </div>
                </div>
            </div>
        { auth.isSignedIn ? (
            <div className="order-last flex flex-row items-center">
                <PillButton id="reserved" text="Follow" backgroundColor="#49e66b" className="color-black cursor-pointer" />
                <FontAwesomeIcon icon={faEllipsis} rotation={90} style={{color: "#000000",}} />
            </div>
        ) : (<></>)}
        </div>
        <div className="flex flex-wrap px-1 ml-10">
          {user.flavors?.map((flavor : Flavor, index : Number) => 
            <PillButton
              key={index.toString()}
              id={flavor.name} text={flavor.name} backgroundColor={flavor.color}
              className="cursor-default"
            />)}
        </div>
      </div>
      
      
  </Link>
    </>
  )
}
