import gql from 'graphql-tag';

const typeDefs = gql`
  scalar Date

  type Query {
    conversations: [Conversation]
  }

  type Mutation {
    createConversation(participantIds: [String]!): createConversationResponse
  }
  type Mutation {
    markConversationAsRead(userId: String!, conversationId: String!): Boolean
  }
  type Mutation {
    deleteConversation(conversationId: String!): Boolean
  }

  type Subscription {
    conversationCreated: Conversation
  }
  type Subscription {
    conversationUpdated: Conversation
  }
  type Subscription {
    conversationDeleted: ConversationDeletedSubscriptionPayload
  }

  type ConversationDeletedSubscriptionPayload {
    id: String
  }

  type Conversation {
    id: String
    latestMessage: Message
    participants: [Participant]
    createAt: Date
    updatedAt: Date
  }

  type Participant {
    id: String
    user: User
    hasSeenLatestMassage: Boolean
  }
  type createConversationResponse {
    conversationId: String
  }
`;

export default typeDefs;
