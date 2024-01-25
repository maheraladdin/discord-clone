import prisma from "./prisma";

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string,
) => {
  let conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId));

  if (!conversation)
    conversation = await createConversation(memberOneId, memberTwoId);

  return conversation;
};

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return prisma.conversation.findFirst({
      where: {
        AND: [{ memberOneId }, { memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("[FIND_CONVERSATION_ERROR]: ", error);
  }
};
const createConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return prisma.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("[CREATE_CONVERSATION_ERROR]: ", error);
  }
};
