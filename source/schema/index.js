import {
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import { user } from './user';
import { contact } from './contact';

// import {testSubscription2} from '../../route'
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    description: 'Root query object',
    fields: (conn) => {
      return {
        users: user.query,
        contacts: contact.query,
      };
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    description: 'Mutation object',
    fields: () => {
      return {
        users: user.mutation,
        contacts: contact.mutation,
      };
    },
  })
});

export default schema;
