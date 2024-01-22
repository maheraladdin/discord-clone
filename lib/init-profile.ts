import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import prisma from "@/lib/prisma";

export default async function initProfile() {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const { id } = user;

  const profile = await prisma.profile.findUnique({
    where: { id },
  });

  if (profile) return profile;

  // Create a new profile
  return prisma.profile.create({
    data: {
      id,
      name: user.firstName + " " + user.lastName,
      email: user.emailAddresses[0].emailAddress,
      imgUrl: user.imageUrl,
    },
  });
}
