const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admins");
const RefreshToken = require("../models/refreshToken");

exports.handleAdminLogin = async (req, res) => {
    // check if email exists or not
    const admin = Admin.findOne({ email: req.body.email });
    if (!admin) return res.status(400).json({ error: "Invalid email or password." });
    
    // check if password is correct or not
    const validPassword = bcrypt.compare(req.body.password, admin.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid email or password." });
    
    // make tokens
    const accessToken = generateAccessToken({ name: admin.name, email: admin.email });
    const refreshToken = generateRefreshToken({ name: admin.name, email: admin.email });

    try {
        await RefreshToken.findOneAndUpdate(
            { email: req.body.email },
            { email: req.body.email, token: refreshToken },
            { upsert: true }
        );
        res.cookie("refresh_token", refreshToken,
            { maxage: 6 * 24 * 60 * 60 * 1000, httpOnly: true, secure: process.env.NODE_ENV === 'production' ? true : false });
        return res.status(200).json({ accessToken, user: { name: admin.name, email: admin.email } });
    } catch (error) {
        return res.status(400).json({ error });
    }
};

// to make a new access token fron refresh token
exports.generateNewAccessToken = async (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) return res.status(401).json({ error: "Access Denied." });

    try {
        const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const rToken = await RefreshToken.findOne({ email: user.email, token: refreshToken });
        if (!rToken) {
            return res.status(401).json({ error: "Access Denied!" });
        } else {
            delete user.iat;
            delete user.exp;
            const newAccessToken = generateAccessToken(user);
            return res.json({ accessToken: newAccessToken, user });
        }
    } catch (error) {
        return res.status(401).json({ error: "Access Denied." });
    }
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
}

function generateRefreshToken(user) {
    return jwt.sign(user, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

//clear cookie, delete refresh token from db => logout
exports.logout = async (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) return res.status(401).json({ error: "Access Denied." });

    try {
        const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        await RefreshToken.findOneAndDelete({ email: user.email });
        res.clearCookie('refresh_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' ? true : false })
        return res.json({ msg: "Logout Successful!" });
    } catch (error) {
        return res.status(401).json({ error: "Access Denied." });
    }
}

//has access Token middleware
exports.authenticateAccessToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];
    if (accessToken == null) return res.status(401).json({ error: "Login Required" });

    jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (error, user) => {
        if (error) return res.status(403).json({ error })
        req.user = user;
        next()
    });
}
