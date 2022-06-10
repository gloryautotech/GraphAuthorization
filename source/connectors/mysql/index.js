import Sequelize from 'sequelize';
import definitions from './definitions';
import relationshipsInit from './relationships';

require('dotenv').config();

const Connection = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    dialect: 'mysql',
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    logging: false,
    omitNull: true,
    pool: {
      max: 100,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
  },
);

definitions.forEach((definition) => {
  Connection.define(definition.name, definition.model, {
    tableName: definition.table,
    uniqueKeys: definition.uniqueKeys,
    timestamps: (definition.table === 'User'|| definition.table === 'Contact' ) ? false : true,
  });
});

const mysql = relationshipsInit(Connection);

export default mysql;
