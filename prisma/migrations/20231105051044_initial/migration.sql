-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "bio" TEXT NOT NULL DEFAULT '',
    "firstName" TEXT NOT NULL DEFAULT '',
    "lastName" TEXT NOT NULL DEFAULT '',
    "userName" TEXT NOT NULL,
    "pfpURL" TEXT NOT NULL DEFAULT 'https://picsum.photos/500/500',
    "location" TEXT NOT NULL DEFAULT '',
    "coverURL" TEXT NOT NULL DEFAULT 'https://picsum.photos/600/600',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Flavor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "color" TEXT NOT NULL DEFAULT '#fc571a'
);

-- CreateTable
CREATE TABLE "Follower" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "followedUserId" INTEGER NOT NULL,
    "myUserId" INTEGER NOT NULL,
    CONSTRAINT "Follower_followedUserId_fkey" FOREIGN KEY ("followedUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Follower_myUserId_fkey" FOREIGN KEY ("myUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Following" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userFollowingId" INTEGER NOT NULL,
    "myUserId" INTEGER NOT NULL,
    CONSTRAINT "Following_userFollowingId_fkey" FOREIGN KEY ("userFollowingId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Following_myUserId_fkey" FOREIGN KEY ("myUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_FlavorToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_FlavorToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Flavor" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FlavorToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Post_name_idx" ON "Post"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Flavor_name_key" ON "Flavor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Follower_myUserId_key" ON "Follower"("myUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Following_myUserId_key" ON "Following"("myUserId");

-- CreateIndex
CREATE UNIQUE INDEX "_FlavorToUser_AB_unique" ON "_FlavorToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_FlavorToUser_B_index" ON "_FlavorToUser"("B");
