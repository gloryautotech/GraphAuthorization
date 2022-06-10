import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
} from 'graphql';
import Contact from './type';
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

// eslint-disable-next-line import/prefer-default-export
export const contact = {
  query: {
    type: new GraphQLList(Contact),
    args: {
      id: {
        type: GraphQLInt,
      },
      name: {
        type: GraphQLString
      }
    },
    async resolve(root, args, context, info) {
      let conetextUser = context.user
      conetextUser = JSON.parse(conetextUser.permission)
      if (conetextUser['dataentry'][1] == 1) {
          return await context.mysql.models.contact.findAll({
          where: { ...args, ...context.created_by },
        });
      } else {
        throw new Error('No read permission granted');
      }
    },
  },
  mutation: {
    type: Contact,
    args: {
      type: {
        type: GraphQLString,
      },
      id: {
        type: GraphQLInt,
      },
      name: {
        type: GraphQLString,
      }
    },
    async resolve(root, args, context, info) {
      const transactionType = args.type;
      let conetextUser = context.user
      conetextUser = JSON.parse(conetextUser.permission)
      if (transactionType == 'create') {
        if (conetextUser['dataentry'][0] == 1) {
          return await context.mysql.models.contact.create({
            name: args.name,
            created_by: context.user.id
          });
        }
        else {
          throw new Error('No create permission granted');
        }
      }
      else if (transactionType == 'update') {
        if (conetextUser['dataentry'][2] == 1) {
          await context.mysql.models.contact.update({
            name: args.name,
            created_by: context.user.id
          }, { where: { id: args.id } });
          return await context.mysql.models.contact.findOne({ where: { id: args.id } });
        }
        else {
          throw new Error('No update permission granted');
        }
      }
      else if (transactionType == 'delete') {
        if (conetextUser['dataentry'][3] == 1) {
          await context.mysql.models.contact.destroy({
            where: {
              id: args.id,
            },
          });
        }
        else {
          throw new Error('No delete permission granted');
        }
      }
    }
  },
};
