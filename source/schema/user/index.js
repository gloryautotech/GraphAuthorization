import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
} from 'graphql';
import User from './type';
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

// eslint-disable-next-line import/prefer-default-export
export const user = {
  query: {
    type: new GraphQLList(User),
    args: {
      type: {
        type: GraphQLString,
      },
      id: {
        type: GraphQLInt,
      },
      user_name: {
        type: GraphQLString
      }
    },
    async resolve(root, args, context, info) {
      const userData = await context.mysql.models.user.findAll({
        where: { ...args },
      });
      return userData;
    },
  },
  mutation: {
    type: User,
    args: {
      type: {
        type: GraphQLString,
      },
      id: {
        type: GraphQLInt,
      },
      user_head_id: {
        type: GraphQLInt,
      },
      user_name: {
        type: GraphQLString,
      },
      password: {
        type: GraphQLString,
      },
      email: {
        type: GraphQLString,
      },
      role: {
        type: GraphQLString,
      },
      permission: {
        type: GraphQLString,
      },
    },
    async resolve(root, args, context, info) {
      const transactionType = args.type;
      const roleType = args.role;
      if (transactionType == 'register') {
        if (roleType == 'admin') {
          return await context.mysql.models.user.create({
            email: args.email,
            user_name: args.user_name,
            password: await bcrypt.hash(args.password, 12),
            user_head_id: 0,
            permission: args.permission
          });
        }
        else if (roleType == 'manager') {
          let manager = await context.mysql.models.user.create({
            email: args.email,
            user_name: args.user_name,
            password: await bcrypt.hash(args.password, 12),
            permission: args.permission
          });
          await context.mysql.models.user.update({
            user_head_id: manager.id,
          }, { where: { id: manager.id } });
          return await context.mysql.models.user.findOne({ where: { id: manager.id } });
        }
        if (roleType == 'user') {
          return await context.mysql.models.user.create({
            email: args.email,
            user_name: args.user_name,
            password: await bcrypt.hash(args.password, 12),
            user_head_id: args.user_head_id ? user_head_id : null,
            permission: args.permission
          });
        }
      }
      else if (transactionType == 'update') {
        await context.mysql.models.user.update({
          email: args.email,
          user_name: args.user_name,
          password: await bcrypt.hash(args.password, 12),
          permission: args.permission,
          user_head_id: args.user_head_id ? user_head_id : null
        }, { where: { id: args.id } });
        return await context.mysql.models.user.findOne({ where: { id: args.id } });
      }
      else if (transactionType == 'delete') {
        await context.mysql.models.user.destroy({
          where: {
            id: args.id,
          },
        });
      }
    },
  },
};
