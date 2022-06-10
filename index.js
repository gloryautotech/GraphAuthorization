import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import { createServer } from 'http';
import cors from 'cors';
import express from 'express';
import debugFactory from 'debug';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import router from './route';
import getUserObject from './source/schema/authentication/user';


import './config';
import mysql from './source/connectors/mysql';
// import mongo from './source/connectors/mongo';
import schema from './source/schema';

const debug = debugFactory('server:main');

const app = express();


app.use(express.static('public'));
app.use('*', cors());
app.use(express.json({ limit: '50mb' }));
app.use(
  express.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  }),
);
app.use('/tailorodo', router());

const server = new ApolloServer({
  introspection: true,
  schema,
  context: async ({ req, res, connection }) => {
    const context = {};
    _.assign(context, {
      mysql,
    });
    const token = req ? req.headers.authorization : null;
    try {
      console.log('getting user object from token');
      try {
        let { user, created_by } = await getUserObject(token);
        _.assign(context, { user, created_by });
        return context;
      } catch (e) {
        console.debug('token', token);
        throw new AuthenticationError(e);
      }
    } catch (e) {
      debug('context error: ', e);
      throw new AuthenticationError(e);
    }
  },
});
server.applyMiddleware({
  app,
  path: '/',
  cors: false,
});

const ws = createServer(app);
server.installSubscriptionHandlers(ws);
const port = 8000;

ws.listen(port, () => {
  console.log(`🚀 Server ready at port : ${port}`);
  console.log(`GraphQL API URL: http://localhost:8000`)
  console.log(`Subscriptions URL: http://localhost:8000`)
});
