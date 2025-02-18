import jwt from 'jsonwebtoken'
import configPromise from '@payload-config'

export const verifyToken = async (token: string) => {
  const config = await configPromise
  const secret = config.secret // Using Payload's JWT secret

  return new Promise<{ id: string }>((resolve, reject) => {
    jwt.verify(token, secret, (err: any, decoded: any) => {
      if (err) {
        reject(err)
      } else {
        resolve({ id: decoded.sub }) // Payload uses 'sub' for the user ID
      }
    })
  })
}
