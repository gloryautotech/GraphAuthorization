/* eslint-disable guard-for-in */
import moment from 'moment';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import _ from 'lodash';
import { PubSub } from 'apollo-server';
import sgMail from '@sendgrid/mail';
import mysql from '../connectors/mysql';

const createTrend = require('trendline');
// eslint-disable-next-line import/prefer-default-export

export const pubsub = new PubSub();

export const sleep = (milliseconds) => {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
};

export const upsert = async (model, values, condition) => {
  try {
    console.log('in upsert zoom Contact')
    const obj = await model.findOne({ where: condition });
    console.log('CONDITION', condition);
    console.log('obj', obj && obj.toJSON());
    if (condition && obj) {
      // eslint-disable-next-line no-restricted-syntax
      for (const key in values) {
        const val = values[key];
        if (parseFloat(obj[key]) !== val) {
          obj.isUpdatedRecord = true;
          _.assign(obj, values);
          console.log('between')
          return obj.update(values);
        }
      }
      obj.isUpdatedRecord = false;
      console.log("in if")
      return obj;
      // eslint-disable-next-line no-else-return
    } else {
      // insert
      console.log('CREATING MODEL', values);
      return model.create(values);
    }
  } catch (error) {
    console.log('upsert error', error);
    // console.log('model', model);
    throw error;
  }
};

export const generateTrendValue = (data, xAxis, yAxis, counter) => {
  const trend = createTrend(data, yAxis, xAxis);
  const predictionValue = trend.calcY(counter);
  return predictionValue;
};

export const capConvObservations = (Obv, size) => {
  for (const object of Obv) {
    let convObservationsArray = JSON.parse(object.observations);

    if (convObservationsArray != null) {
      if (convObservationsArray.length > size) {
        convObservationsArray = convObservationsArray.slice(0, size);
        object.observations = JSON.stringify(convObservationsArray);
      }
    }
    let convHowToWorkWithArray = JSON.parse(object.how_to_work_with);
    if (convHowToWorkWithArray != null) {
      if (convHowToWorkWithArray.length > size) {
        convHowToWorkWithArray = convHowToWorkWithArray.slice(0, size);
        object.how_to_work_with = JSON.stringify(convHowToWorkWithArray);
      }
    }
    let convHowToFollowUpArray = JSON.parse(object.how_to_follow_up);
    if (convHowToFollowUpArray != null) {
      if (convHowToFollowUpArray.length > size) {
        convHowToFollowUpArray = convHowToFollowUpArray.slice(0, size);
        object.how_to_follow_up = JSON.stringify(convHowToFollowUpArray);
      }
    }
  }
  return Obv;
};
export const resolveKey = (obj, path) => {
  return path.split('.').reduce((prev, curr) => prev && prev[curr], obj);
};

export const getOauthAccessToken = async (zoom_user, context) => {
  try {
    if (!zoom_user) throw new Error('Zoom credentials not found.');
    console.log('in function getOauthAccessToken');
    const lastUpdated = moment.utc(zoom_user.updatedAt);
    const currentTime = moment.utc(new Date().toISOString());
    console.log('zoom_user', zoom_user);
    console.log(`currentTime.diff(lastUpdated, 'minutes') <= 50`, currentTime.diff(lastUpdated, 'minutes') <= 50);
    if (currentTime.diff(lastUpdated, 'minutes') <= 50) {
      const accessToken = CryptoJS.AES.decrypt(
        zoom_user.access_token,
        process.env.ZOOM_SECRET,
      ).toString(CryptoJS.enc.Utf8);
      console.log('accessToken: ', accessToken);
      return accessToken;
    }
    let refreshToken = CryptoJS.AES.decrypt(
      zoom_user.refresh_token,
      process.env.ZOOM_SECRET,
    ).toString(CryptoJS.enc.Utf8);
    let url = `https://zoom.us/oauth/token?grant_type=refresh_token&refresh_token=${refreshToken}`;
    console.log('refeshing token at: ', url);
    let baseEncoded = Buffer.from(
      `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`,
    ).toString('base64');
    console.log('refreshToken', refreshToken);
    console.log('CLIENT_ID: ', process.env.CLIENT_ID);
    console.log('CLIENT_SECRET: ', process.env.CLIENT_SECRET);
    console.log('baseEncoded', baseEncoded);
    const res = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Basic ${baseEncoded}`,
        },
      },
    );
    if (res.data.access_token) {
      await mysql.models.zoom_user_app.update(
        {
          refresh_token: CryptoJS.AES.encrypt(
            res.data.refresh_token,
            process.env.ZOOM_SECRET,
          ).toString(),
          access_token: CryptoJS.AES.encrypt(
            res.data.access_token,
            process.env.ZOOM_SECRET,
          ).toString(),
        },
        {
          where: {
            zoom_user_id: zoom_user.zoom_user_id,
          },
        },
      );
      return res.data.access_token;
    }
  } catch (e) {
    console.error('errorerrorerrorerror', e.message);
    if (_.isEqual(_.get(e, 'response.data.reason'), 'Invalid Token!')) {
      throw new Error('AUTHORIZATION_ERROR: Error while fetching access token.');
    }
  }
};

export const formatDate = (dateObject, array, separator) => {
  const format = (dateOption) => {
    const datePart = new Intl.DateTimeFormat('en-US', dateOption);
    return datePart.format(dateObject);
  };
  return array.map(option => format(option)).join(separator);
};

export const sendEmail = async (msg) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  if (process.env.NODE_ENV === 'production' || process.env.EMAIL_DEBUG === 'on') {
    await sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
        return {
          status: true,
          msg: 'Email sent',
        };
      })
      .catch((error) => {
        console.error('sada', error);
        return {
          status: true,
          msg: 'error',
          data: error.message,
        };
      });
  }
};

export const addInPipeline = async (context, {
  stage, name, message, success = true, step, processed = 0, status = 1}, save = false) => {
  const pipeLineStage = context.pipelineLogs[stage];
  let steps = [];
  steps = pipeLineStage ? pipeLineStage.steps : [];
  if (step) {
    steps.push(step)
  }
  context.pipelineLogs[stage] = {
    stage,
    message: message ? message : pipeLineStage ? pipeLineStage.message : '',
    name: name ? name : pipeLineStage ? pipeLineStage.name : '',
    status: status,
    success: success,
    processed: processed ? processed : pipeLineStage ? pipeLineStage.processed : 0,
    steps
  }

  if (save) {
    const convId = context.conversation.id;
    await mysql.models.conversation.update({
      pipeline_status: JSON.stringify(context.pipelineLogs)
    }, { where: { id: convId } })
  }
  return context;
};

export const savePipeline = async (args) => {
  if (args.save) {
    const convId = args.conversation.id;
    await mysql.models.conversation.update({
      pipeline_status: JSON.stringify(args.pipeline)
    }, { where: { id: convId } })
  }
};
