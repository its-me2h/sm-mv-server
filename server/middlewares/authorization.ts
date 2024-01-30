import dotenv from 'dotenv'
dotenv.config()

import jwt from 'jsonwebtoken'


const authorization = (request: any, response: any, next: any) => {

    console.log(request.body.variables)
    // GET ACCESS TOKEN FROM HEADERS
    let accessToken = request.headers.authorization || request.headers.Authorization || null
    // IF ACCESS TOKEN NOT NULL
    if (accessToken) {
        // VERIFY IT IS VALID AND GET DECODED INFO
        try {
            const decoded: any = jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET as string
            )
            request.id = decoded.id
            request.role = decoded.role
            next()
        // IF ERROR TRY TO REFRESH TOKENS
        } catch (error) {
            request.error = 'Access token is invalid'
            next()
        }
    // ELSE ACCESS TOKEN IS NULL, TRY TO REFRESH TOKENS
    } else {
        return { response: 'Access token is missing'}
    }
}

export default authorization