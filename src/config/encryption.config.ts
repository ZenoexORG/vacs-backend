export const encryptionConfig = {
    saltRounds: 10,
    jwtSecret: process.env.JWT_SECRET || 'defaultSecretKey',
    jwtExpiration: process.env.JWT_EXPIRATION,
}