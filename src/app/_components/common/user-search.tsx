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

  return (
    <>
    <Link href={`/profile/${user.userName}`}>
      <div className="px-5 flex flex-row items-center justify-between mb-4">
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
              <PillButton id="reserved" text="Follow" backgroundColor="#49e66b" className="color-black" />
              <FontAwesomeIcon icon={faEllipsis} rotation={90} style={{color: "#000000",}} />
          </div>
      ) : (<></>)}
          
      </div>
  </Link>
    </>
  )
}
