import formidable from "formidable";
import path, { resolve } from "path";
import { rename, existsSync, mkdir } from "fs";
import { files_array } from "../model.js";

import jsonwebtoken from 'jsonwebtoken';
const { sign, verify } = jsonwebtoken;

const fileController = {

    saveFile: async (req, res) => {
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
                return new Promise((resolve, reject) => {
                    form.parse(req, function (err, fields, files) {
                        if (!existsSync(path.join(path.resolve(), 'upload', decoded.email))) {
                            mkdir(path.join(path.resolve(), 'upload', decoded.email), (err) => {
                            })
                        }
                        rename(files.file.path, path.join(path.resolve(), 'upload', decoded.email, files.file.path.split('\\').pop()), () => {
                            let time = Date.now()
                            resolve({
                                id: time,
                                album: decoded.email,
                                originalName: files.file.name,
                                url: path.join(path.resolve(), 'upload', decoded.email, files.file.path.split('\\').pop()),
                                lastChange: 'original',
                                history: [
                                    { status: 'original', url: path.join(path.resolve(), 'upload', decoded.email, files.file.path.split('\\').pop()), lastModifiedDate: time }
                                ],
                                tags: []
                            })
                        })
                        if (err) {
                            console.error(err)
                            res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
                            res.end(String(err));
                            reject(err)
                        }
                    })
                })
            }
        } catch (err) {

        }
    },
    deleteFile: (id) => {
        files_array.splice(files_array.indexOf(files_array.find(files => files.id == id)), 1);
    },
    editFile: async (req, res, id) => {
        let form = formidable({});
        form.keepExtensions = true;
        form.uploadDir = path.join(path.resolve(), 'temp')
        const oldfile = files_array.find(files => files.id == id);
        return new Promise((resolve, reject) => {
            form.parse(req, function (err, fields, files) {
                console.log(fields);
                rename(files.file.path, path.join(path.resolve(), 'upload', oldfile.album, files.file.path.split('\\').pop()), () => {
                    resolve({
                        album: fields.album,
                        originalName: files.file.name,
                        url: path.join(path.resolve(), 'upload', oldfile.album, files.file.path.split('\\').pop()),
                        time: time,
                        changeName: ''
                    })
                })
                if (err) {
                    console.error(err)
                    res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
                    res.end(String(err));
                    reject(err)
                }
            })
        })
    }
}

export default fileController