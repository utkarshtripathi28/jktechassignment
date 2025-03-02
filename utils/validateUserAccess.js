let db = require("../models");

const validateUserAccess = async (username, apiEndpoint) => {
  try {
    if(!username || !apiEndpoint) return {doc:null,err:true,msg:"Details Insufficient"}
    let docCount = await db.users.count({
        where: {
          username
        },
        include: [
            {
              model: db.roles,
              as: "roles",
              required: true,
              include: [
                {
                  model: db.apiEndpoints,
                  as: "apiEndpoints",
                  required: true,
                  where:{
                    apiEndpoint: apiEndpoint
                  },
                  through: { attributes: [], where:{isActive: 1} },
                }
              ]
            }
          ]
      });
    
    if (docCount === 0) {
      return {doc:false,err:false,msg:"You don't have permission to access this api"}
    }
    return {doc:true,err:false,msg:"Access to this api allowed"}
  } catch (error) {
    throw error;
  }
};

module.exports = { validateUserAccess };
