import jsonwebtoken from 'jsonwebtoken';
const { sign, verify } = jsonwebtoken;

const createToken = () => {

    let token = sign(
        {
            email: "aaa@test.com",
            anyOtherData: "123"
        },
        "verysecretkey",
        {
            expiresIn: "1s"
        }
    );
    console.log({ token: token });
}

const verifyToken = (token) => {

    try {
        let decoded = verify(token, "verysecretkey")
        console.log({ decoded: decoded });
    }
    catch (ex) {
        console.log({ message: ex.message });
    }
}


const processToken = () => {
    createToken()
    verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFhYUB0ZXN0LmNvbSIsImFueU90aGVyRGF0YSI6IjEyMyIsImlhdCI6MTcxNjM3Nzg3NSwiZXhwIjoxNzE2Mzc3OTA1fQ.dR1jHnFlfUs4UAweMgNcnq_5kEqJkRVIjbcVaiCzuQQ")
}

processToken()
