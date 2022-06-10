import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';
import { ValidationError, Op, QueryTypes } from 'sequelize';
import CryptoJS from 'crypto-js';
import { getOauthAccessToken } from '../utils';

const User = new GraphQLObjectType({
  name: 'User',
  description: 'This represents a User',
  fields() {
    return {
      id: {
        type: GraphQLInt,
        resolve(user) {
          return user.id;
        },
      },
      email: {
        type: GraphQLString,
        resolve(user) {
          return user.email;
        },
      },
      username: {
        type: GraphQLString,
        resolve(user) {
          return user.user_name;
        },
      },
      user_head_id: {
        type: GraphQLInt,
        resolve(user) {
          return user.user_head_id;
        },
      },
      permission: {
        type: GraphQLString,
        resolve(user) {
          return user.permission;
        },
      },
    };
  },
});

export default User;
