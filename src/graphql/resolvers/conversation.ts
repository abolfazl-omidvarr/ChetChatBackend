import { Prisma, User } from '@prisma/client';
import {
  ConversationCreatedSubscriptionPayload,
  ConversationDeletedSubscriptionPayload,
  ConversationPopulated,
  ConversationUpdatedSubscriptionPayload,
  GraphQLContext,
  ParticipantPopulated,
} from '../../util/types';
import { GraphQLError } from 'graphql';
import { withFilter } from 'graphql-subscriptions';
import { userIsConversationParticipant } from '../../util/functions';

const resolvers = {
  Query: {
    conversations: async (
      _parent: any,
      _args: any,
      context: GraphQLContext
    ): Promise<Array<ConversationPopulated>> => {
      const { prisma, tokenPayload } = context;
      const { code, payload } = tokenPayload;
      if (code !== 200) {
        throw new GraphQLError(
          'You are not authorized to perform this action.',
          {
            extensions: {
              code: code,
            },
          }
        );
      }
      try {
        const userId = payload?.userId;

        const conversations = await prisma.conversation.findMany({
          where: {
            participants: {
              some: {
                userId: {
                  equals: userId,
                },
              },
            },
          },
          include: conversationPopulated,
        });

        return conversations;
      } catch (error: any) {
        console.log('conversation error: ', error);
        throw new GraphQLError(error.message);
      }
    },
  },
  Mutation: {
    createConversation: async (
      _parent: any,
      args: { participantIds: Array<string> },
      context: GraphQLContext
    ): Promise<{ conversationId: string }> => {
      const { prisma, res, pubSub } = context;
      const { participantIds } = args;

      const { code, payload } = res?.locals.tokenPayload;

      console.log('here is pubSub in createConversation', pubSub);

      if (code !== 200) {
        throw new GraphQLError(
          'You are not authorized to perform this action.',
          {
            extensions: {
              code: code,
            },
          }
        );
      }
      try {
        const conversation = await prisma.conversation.create({
          data: {
            participants: {
              createMany: {
                data: participantIds.map((id) => ({
                  userId: id,
                  hasSeenLatestMassage: id === payload.userId,
                })),
              },
            },
          },
          include: conversationPopulated,
        });

        pubSub?.publish('CONVERSATION_CREATED', {
          conversationCreated: conversation,
        });

        return { conversationId: conversation.id };
      } catch (error: any) {
        console.log(error);
        throw new GraphQLError(
          'Create conversation has encountered an error: ',
          error
        );
      }
    },
    markConversationAsRead: async (
      _parent: any,
      args: { conversationId: string; userId: string },
      context: GraphQLContext
    ): Promise<boolean> => {
      const { prisma, tokenPayload } = context;
      const { conversationId, userId: reqUserId } = args;
      const { code, status, payload } = tokenPayload;
      if (code !== 200)
        throw new GraphQLError('Not authorized to perform this action');

      const userId = payload?.userId;

      try {
        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            conversationId,
            userId,
          },
        });

        //always exist but being safe is no harm
        if (!participant)
          throw new GraphQLError(
            'error in marking conversation as read function: participant find error'
          );

        await prisma.conversationParticipant.update({
          where: {
            id: participant.id,
          },
          data: {
            hasSeenLatestMassage: true,
          },
        });

        return true;
      } catch (error: any) {
        console.log('markConversationAsRead:', error?.message);
        throw new GraphQLError(
          'error in marking conversation as read function'
        );
      }
    },
    deleteConversation: async (
      _parent: any,
      args: { conversationId: string },
      context: GraphQLContext
    ): Promise<boolean> => {
      const { prisma, pubSub, tokenPayload } = context;
      const { conversationId } = args;
      const { code, payload } = tokenPayload;
      if (code !== 200) {
        throw new GraphQLError(
          'You are not authorized to perform this action.',
          {
            extensions: {
              code: code,
            },
          }
        );
      }
      try {
        //delete conversation and all its entities with prisma transaction
        // const [deletedConversation] = await prisma.$transaction([
        //   prisma.conversation.delete({
        //     where: {
        //       id: conversationId,
        //     },
        //     include: conversationPopulated,
        //   }),
        //   prisma.conversationParticipant.deleteMany({
        //     where: {
        //       conversationId,
        //     },
        //   }),
        //   prisma.message.deleteMany({
        //     where: {
        //       conversationId,
        //     },
        //   }),
        // ]);
        await prisma.conversationParticipant.deleteMany({
          where: {
            conversationId,
          },
        });
        console.log('conversationParticipant deleted');

        const deletedConversation = await prisma.conversation.delete({
          where: {
            id: conversationId,
          },
          include: conversationPopulated,
        });
        console.log('Conversation deleted');

        await prisma.message.deleteMany({
          where: {
            conversationId,
          },
        });
        console.log('message deleted');

        pubSub.publish('CONVERSATION_DELETE', {
          conversationDeleted: deletedConversation,
        });
      } catch (error) {
        console.log('delete conversation failed:', error);
        throw new GraphQLError('delete conversation failed');
      }
      return true;
    },
  },
  Subscription: {
    conversationCreated: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubSub } = context;

          return pubSub.asyncIterator(['CONVERSATION_CREATED']);
        },
        (
          payload: ConversationCreatedSubscriptionPayload,
          _variables: any,
          context: GraphQLContext
        ) => {
          const { tokenPayload } = context;

          if (tokenPayload.code !== 200) {
            throw new GraphQLError('Not authorized: ' + tokenPayload.status);
          }

          const userId = tokenPayload.payload!.userId;

          const {
            conversationCreated: { participants },
          } = payload;

          return userIsConversationParticipant(participants, userId);
        }
      ),
    },
    conversationUpdated: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubSub } = context;

          return pubSub.asyncIterator(['CONVERSATION_UPDATED']);
        },
        (
          payload: ConversationUpdatedSubscriptionPayload,
          _variables: any,
          context: GraphQLContext
        ) => {
          const { tokenPayload } = context;

          if (tokenPayload.code !== 200) {
            throw new GraphQLError('Not authorized: ' + tokenPayload.status);
          }

          const userId = tokenPayload.payload!.userId;

          const {
            conversationUpdated: { participants },
          } = payload;

          return userIsConversationParticipant(participants, userId);
        }
      ),
    },
    conversationDeleted: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubSub } = context;
          return pubSub.asyncIterator(['CONVERSATION_DELETE']);
        },
        (
          payload: ConversationDeletedSubscriptionPayload,
          _variables: any,
          context: GraphQLContext
        ) => {
          const { tokenPayload } = context;

          if (tokenPayload.code !== 200) {
            throw new GraphQLError('Not authorized: ' + tokenPayload.status);
          }

          const userId = tokenPayload.payload!.userId;

          const {
            conversationDeleted: { participants },
          } = payload;

          return userIsConversationParticipant(participants, userId);
        }
      ),
    },
  },
};

export const participantPopulated =
  Prisma.validator<Prisma.ConversationParticipantInclude>()({
    user: {
      select: {
        id: true,
        username: true,
      },
    },
  });

export const conversationPopulated =
  Prisma.validator<Prisma.ConversationInclude>()({
    participants: {
      include: participantPopulated,
    },
    latestMessage: {
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    },
  });

export default resolvers;
