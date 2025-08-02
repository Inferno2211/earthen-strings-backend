const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class TokenService {
    constructor() {
        this.accessTokenSecret = process.env.JWT_ACCESS_SECRET;
        this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
        this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
        this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';
    }

    // Generate access token
    generateAccessToken(userId, role) {
        return jwt.sign(
            { userId, role },
            this.accessTokenSecret,
            { expiresIn: this.accessTokenExpiry }
        );
    }

    // Generate refresh token
    generateRefreshToken(userId) {
        return jwt.sign(
            { userId },
            this.refreshTokenSecret,
            { expiresIn: this.refreshTokenExpiry }
        );
    }

    // Generate both tokens
    generateTokens(userId, role) {
        const accessToken = this.generateAccessToken(userId, role);
        const refreshToken = this.generateRefreshToken(userId);

        return { accessToken, refreshToken };
    }

    // Verify access token
    verifyAccessToken(token) {
        try {
            return jwt.verify(token, this.accessTokenSecret);
        } catch (error) {
            throw new Error('Invalid access token');
        }
    }

    // Verify refresh token
    verifyRefreshToken(token) {
        try {
            return jwt.verify(token, this.refreshTokenSecret);
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    // Generate email verification token
    generateEmailVerificationToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    // Generate password reset token
    generatePasswordResetToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    // Generate OTP
    generateOTP(length = 6) {
        return Math.floor(Math.random() * Math.pow(10, length))
            .toString()
            .padStart(length, '0');
    }

    // Decode token without verification (for getting payload)
    decodeToken(token) {
        try {
            return jwt.decode(token);
        } catch (error) {
            return null;
        }
    }

    // Check if token is expired
    isTokenExpired(token) {
        try {
            const decoded = jwt.decode(token);
            if (!decoded || !decoded.exp) return true;

            return Date.now() >= decoded.exp * 1000;
        } catch (error) {
            return true;
        }
    }
}

module.exports = new TokenService(); 