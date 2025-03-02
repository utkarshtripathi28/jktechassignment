const { resServerError, resFound, resErrorOccured } = require('../utils/response');
const { getToken } = require('../utils/jwt');
const { users, verifyPassword } = require('../services/authService');
const { addUsers } = require('./users');

const login = async(req, res) => {
    try {
        const { username, password } = req.body;
        let pass=password
        if(!username || !password)return resErrorOccured(res,"All fields are required")
        let user = await users(username)
        if(user.err==true) return resErrorOccured(res, user.msg)
        if (user) {
            user=user?.doc     
            storedHash = user?.password;
            let isValid = await verifyPassword(pass,storedHash)
            if(isValid.err==true) return resErrorOccured(res,isValid.msg)
            if(isValid){
                let { roles,password, ...userData } = user;
                userData = {
                    ...userData,
                    role: user?.roles?.name
                }
                const token = await getToken(userData)
                return resFound(res,token,'Login successful')
            }
            else return resErrorOccured(res, "Invalid id or password")
        }
         else return resErrorOccured(res, "Invalid id or password")
    } catch (err) {
        return resServerError(res,err)
    }
};
const register = async(req, res) => {
    try {
        const {username, password} = req.body
        if(!username || !password){
            return resErrorOccured(res,"Insufficient details")
        }
        await addUsers(req,res)
    } catch (error) {
        return resServerError(res,error)
    }   
};
const logout = async(req, res) => {
    console.log("logout");
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged out successfully' });
};
module.exports = {
    register,
    login,    
    logout
};