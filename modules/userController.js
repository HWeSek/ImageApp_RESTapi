import "dotenv/config";
import getRequestData from "./utils.js";
import { users_array } from "./model.js";
import { validate as email_validate } from "email-validator";
import bcryptjs from "bcryptjs";
const { hash, compare } = bcryptjs;

import jsonwebtoken from 'jsonwebtoken';
const { sign, verify } = jsonwebtoken;


const userController = {
    registerUser: async (req, res) => {
        const user_data = JSON.parse(await getRequestData(req));
        if (email_validate(user_data.email)) {
            if (users_array.find(user => user.email == user_data.email)) {
                res.writeHead(404, "Content-Type: application/json;charset=utf-8")
                res.write(JSON.stringify({ status: 404, message: `user with email ${user_data.email} already exists!` }, null, 3));
                res.end()
            } else {
                let new_user = {
                    name: user_data.name,
                    lastName: user_data.lastName,
                    email: user_data.email,
                    password: await hash(user_data.password, 10),
                    verified: false
                }
                users_array.push(new_user);
                const confirmation_token = sign(new_user, process.env.SECRET_KEY, { expiresIn: "1h" })
                res.writeHead(201, "Content-type: application/json;charset=utf-8")
                res.write(JSON.stringify({ status: 201, message: `User created! Please verify your account by pasitng this link into your browser: http://localhost:3000/api/user/confirm/${confirmation_token}` }, null, 3));
                res.end();
            }
        }
    },
    confirmUser: async (token, res) => {
        try {
            let decoded = verify(token, process.env.SECRET_KEY);
            if (decoded) {
                let account = users_array.find(user => user.email == decoded.email)
                account.verified = true;
                console.log(account);
                res.writeHead(200, "Content-type: application/json;charset=utf-8")
                res.write(JSON.stringify({ status: 200, message: `User ${decoded.email} has been verified!` }, null, 3));
                res.end();
            }
        } catch (error) {
            res.writeHead(400, "Content-type: application/json;charset=utf-8")
            res.write(JSON.stringify({ status: 400, message: error.message }, null, 3));
            res.end();
        }
    },
    userLogin: async (req, res) => {
        
    }
}
export default userController