const util = require('util');
const winston = require('winston');
const WinstonCloudWatch = require('winston-cloudwatch');
import { Op, QueryTypes } from 'sequelize';
import mysql from '../mysql';
const utilFormat = (enableColor) => {
  const printFormat = winston.format.printf(
    ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`,
  );
  const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transform: (info) => {
        const args = info[Symbol.for('splat')] || [];
        info.message = util.formatWithOptions(
          { colors: enableColor },
          info.message,
          ...args,
        );
        info.level = info.level.toUpperCase()[0];
        return info;
      },
    },
  );
  return enableColor
    ? winston.format.combine(format, winston.format.colorize(), printFormat)
    : winston.format.combine(format, printFormat);
};

// const levels = {
//   error: 0,
//   warn: 1,
//   info: 2,
//   http: 3,
//   verbose: 4,
//   debug: 5,
//   silly: 6
// };

const logLevel = async () => {
  let response;
  try {
    const sql = `select * from logging_level where server = 'prod'`
    const ele = await mysql.query(sql, { type: QueryTypes.SELECT })
    console.log('loggingData', ele)
    const level = ele && ele.length ? ele[0].level : 'info'
    console.log('level', level)
    // const a = process.env.consoleLoggingLevel ? process.env.consoleLoggingLevel : 'info'
    // response = 'info';
    return 'info';
    // return 'error'
  } catch (error) { console.log('errir in loglevel function', error) }

}
const transports = [
  new winston.transports.Console({
    format: utilFormat(true),
    level: process.env.consoleLoggingLevel ? process.env.consoleLoggingLevel : 'info'
  }),
];

const logger = winston.createLogger({
  transports,
});

console.log = function (message, ...args) {
  logger.info(message, ...args);
};
console.info = function (message, ...args) {
  logger.info(message, ...args);
};
console.warn = function (message, ...args) {
  logger.warn(message, ...args);
};
console.error = function (message, ...args) {
  const agrs = args && args.length ? args[0] : {}
  if (agrs.save) {
    const convId = agrs.conversation.id;
    mysql.models.conversation.update({
      pipeline_status: JSON.stringify(agrs.pipeline)
    }, { where: { id: convId } })
  }
  logger.error(message, ...args);
};
console.debug = function (message, ...args) {
  logger.debug(message, ...args);
};
console.silly = function (message, ...args) {
  logger.silly(message, ...args);
};