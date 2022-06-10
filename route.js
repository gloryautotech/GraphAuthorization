import { Router } from 'express';
// import { RateLimiterMySQL } from 'rate-limiter-flexible';
import mysql from './source/connectors/mysql';
// import CryptoJS from 'crypto-js';
// import debugFactory from 'debug';
// import * as request from 'request';
// import { Op, QueryTypes } from 'sequelize';
// import { v4 as uuidv4 } from 'uuid';
// import { WebClient } from '@slack/web-api';
// import passportGoogleOauth from 'passport-google-oauth';
import express from 'express';
import User from './source/schema/user/type';

// export { sendEmail } from './source/schema/utils';
// const crypto = require('crypto');

const router = Router();

const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
// const sgMail = require('@sendgrid/mail');
// const handlebars = require('handlebars');
// const moment = require('moment');
// const path = require('path');
// const passportSaml = require('passport-saml');
// const { MultiSamlStrategy } = passportSaml;
// const { OAuth2Strategy } = passportGoogleOauth;


// const debug = debugFactory('server:route');

// const isEmail = (email) => {
//   const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   return re.test(email);
// };

const jwt = require('jsonwebtoken');
const fs = require('fs');
const _ = require('lodash');
// const passwordRegex = /^(?=.*)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

// const ready = (err) => {
//   if (err) {
//     debug(err);
//   } else {
//     console.log('Successful');
//   }
// };

// export const validateUser = async (username, password, tokenIsValid = false) => {
//   const currentUser = isEmail(username)
//     ? await mysql.models.user.findOne({
//       where: { email: username, is_active: true },
//     })
//     : await mysql.models.user.findOne({
//       where: { user_name: username, is_active: true },
//     });
//   if (!currentUser) return { user: currentUser, valid: false };
//   if (currentUser && !password && tokenIsValid) return { user: currentUser, valid: true };
//   if (!password && !tokenIsValid) return { user: currentUser, valid: false };
//   const isValid = await bcrypt.compare(
//     password,
//     currentUser.password,
//   );
//   return { user: currentUser, valid: isValid };
// };

// export const verifyToken = (token) => {
//   const res = { valid: false, decoded: null, error: null };
//   jwt.verify(
//     token,
//     process.env.JWT_SECRET,
//     (err, decoded) => {
//       if (err) {
//         console.log('token failed verification');
//         _.assign(res, {
//           valid: false,
//           decoded,
//           error: err,
//         });
//         console.debug('res', res);
//       } else {
//         console.log('decoded', decoded);
//         const user_name = decoded.email;
//         _.assign(res, {
//           valid: true,
//           decoded,
//           error: null,
//         });
//       }
//     },
//   );
//   return res;
// };

export default () => {
    router.use((req, res, next) => {
        res.on('finish', () => {
        });
        next();
    });

    //   /** Parse the body of the request / Passport */
    router.use(express.urlencoded({ extended: false })); // Replaces Body Parser
    router.use(express.json()); // Replaces Body Parser

    //   /** Rules of our API */
    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', req.header('origin'));
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.header('Access-Control-Allow-Credentials', 'true');

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }
        next();
    });
    router.post('/login', async (req, res) => {
        try {
            const user_name = req.body.username;
            let user = await mysql.models.user.findOne({
                where: { user_name: user_name },
            })
            if (!user) throw new Error('No user with that email');
            const isValid = await bcrypt.compare(
                req.body.password,
                user.password,
            );
            if(user.user_head_id != 0){
                if (!isValid) throw new Error('Incorrect password');
            }
            const token = jsonwebtoken.sign(
                {
                    name: user.user_name,
                    email: user.email,
                    permission: user.permission
                },
                process.env.JWT_SECRET,
                { expiresIn: '30d' },
            );
            res.json({
                user,
                token,
            });
        } catch (error) {
            res.send(error.message);
        }
    });
    return router;
}
