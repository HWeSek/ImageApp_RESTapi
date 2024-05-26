import "dotenv/config";
import getRequestData from "../utils.js";
import { users_array, expired_tokens } from "../model.js";
import { validate as email_validate } from "email-validator";
import bcryptjs from "bcryptjs";
const { hash, compare } = bcryptjs;

import jsonwebtoken from 'jsonwebtoken';
const { sign, verify } = jsonwebtoken;

import path, { resolve } from "path";
import { rename, existsSync, mkdir } from "fs";
import formidable from "formidable";


const profileController = {
    getProfileData: (req, res) => {
        const token = req.headers.authorization.split(" ")[1]
        try {
            let decoded = verify(token, process.env.SECRET_KEY);
            if (decoded) {
                let account = users_array.find(user => user.email == decoded.email)
                res.writeHead(200, "Content-type: application/json;charset=utf-8")
                res.write(JSON.stringify({ name: account.name, lastName: account.lastName, email: account.email }, null, 3));
                res.end();
            }
        } catch (error) {
            res.writeHead(400, "Content-type: application/json;charset=utf-8")
            res.write(JSON.stringify({ status: 400, message: error.message }, null, 3));
            res.end();
        }
    },
    editProfileData: async (req, res) => {
        const token = req.headers.authorization.split(" ")[1]
        const data = JSON.parse(await getRequestData(req));
        try {
            let decoded = verify(token, process.env.SECRET_KEY);
            if (decoded) {
                if (data) {
                    let account = users_array.find(user => user.email == decoded.email)
                    account.name = data.name;
                    account.lastName = data.lastName;
                    res.writeHead(200, "Content-type: application/json;charset=utf-8")
                    res.write(JSON.stringify({ status: 200, message: "Profile data changed!" }, null, 3));
                    res.end();
                }
            }
        } catch (error) {
            res.writeHead(400, "Content-type: application/json;charset=utf-8")
            res.write(JSON.stringify({ status: 400, message: error.message }, null, 3));
            res.end();
        }
    },

    uploadProfilePicture: async (req, res) => {
        if (!existsSync(path.join(path.resolve(), 'temp'))) {
            mkdir(path.join(path.resolve(), 'temp'), (err) => {
            })
        }
        if (!existsSync(path.join(path.resolve(), 'upload'))) {
            mkdir(path.join(path.resolve(), 'upload'), (err) => {
            })
        }

        let form = formidable({});
        form.keepExtensions = true;
        form.uploadDir = path.join(path.resolve(), 'temp')

        const token = req.headers.authorization.split(" ")[1]
        try {
            let decoded = verify(token, process.env.SECRET_KEY);
            if (decoded) {
                form.parse(req, function (err, fields, files) {
                    if (!existsSync(path.join(path.resolve(), 'upload', decoded.email))) {
                        mkdir(path.join(path.resolve(), 'upload', decoded.email), (err) => {
                        })
                    }
                    rename(files.file.path, path.join(path.resolve(), 'upload', decoded.email, "pfp.png"), () => {
                        res.writeHead(200, "Content-type: application/json;charset=utf-8")
                        res.write(JSON.stringify({ status: 200, message: "Profile picture changed!" }, null, 3));
                        res.end();
                    })
                    if (err) {
                        res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
                        res.end(String(err));
                    }
                })
            }
        } catch (error) {
            res.writeHead(400, "Content-type: application/json;charset=utf-8")
            res.write(JSON.stringify({ status: 400, message: error.message }, null, 3));
            res.end();
        }
    },
    logout: (req, res) => {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            try {
                let token = req.headers.authorization.split(" ")[1]
                let decoded = verify(token, process.env.SECRET_KEY);
                if (decoded) {
                    expired_tokens.push(token);
                    res.writeHead(200, "Content-type: application/json;charset=utf-8")
                    res.write(JSON.stringify({ status: 200, message: "User logged out!" }, null, 3));
                    res.end();
                }

            } catch (error) {
                res.writeHead(400, "Content-type: application/json;charset=utf-8")
                res.write(JSON.stringify({ status: 400, message: error.message }, null, 3));
                res.end();
            }

        }
    }
}
export default profileController