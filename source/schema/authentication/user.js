import jwt from 'jsonwebtoken';
import { QueryTypes } from 'sequelize';
import _ from 'lodash';
import mysql from '../../connectors/mysql';

async function getUserObject(token) {
  try {
    let arrOfUserIdUnderManager = [];
    const returnObj = {};
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const username = decodedToken.name;
    const user = await mysql.models.user.findOne({
      where: { user_name: username },
    });
    returnObj.user = user;
    if (user.user_head_id == 0) {
      //is_admin 
    }
    else if (user.id == user.user_head_id) {
      //is_manager 
      const userUnderManager = await mysql.models.user.findAll({
        where: { user_head_id: user.id },
      });
      arrOfUserIdUnderManager = userUnderManager.map((userUnder) => userUnder.id);
      returnObj.created_by = { id: arrOfUserIdUnderManager };
    }
    else if (user.id != user.user_head_id) {
      //is_user
      returnObj.created_by = { id: user.id };
    }
    return returnObj;
  } catch (e) {
    console.log('JWT verification error: ', e);
    throw e;
  }
}

export default getUserObject;
