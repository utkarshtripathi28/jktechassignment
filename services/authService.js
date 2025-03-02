const { Op } = require("sequelize");
const db = require("../models");
const jwt = require("jsonwebtoken");

const users = async(username)=>{
    try {
        if(!username) return {doc: null, err: true, msg:"Please enter username"}
        let user = await db.users.findOne({ 
            where: {
                 username
             },
            include:[
                {
                model: db.roles,
                as:"roles",
                attributes:['name','userType'],
                where:{isActive:true},
                include:[{
                    model: db.apiEndpoints,
                    as:"apiEndpoints",
                    where:{isActive:true},
                    attributes:['Id','name','apiEndpoint'],
                    through:{attributes:['Id','apiEndpointId','roleId'],where:{isActive: true}},
                    required:false,
                }]
            }] 
        });
        if(user) {
            user=user?.get({plain:true})
            return {doc: user, err: false, msg: "User found"}
        }
        return {doc: null, err: true, msg: "Invalid id or password"}
    } catch (error) {
        throw error
    }
}
async function verifyPassword(enteredPassword, storedHash) {
    try {
      if(!enteredPassword || !storedHash) return {doc:null, err: true, msg:"Details Insufficient"}
      return await bcrypt.compare(enteredPassword, storedHash);
    } catch (err) {
      console.error('Error verifying password:', err);
    }
  }
module.exports = {users, verifyPassword}