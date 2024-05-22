import bcryptjs from "bcryptjs";
const { hash, compare } = bcryptjs;
let passwd = "DUPA";
const hashed = await hash(passwd, 5);
console.log(await compare("NIEDUpa", hashed));