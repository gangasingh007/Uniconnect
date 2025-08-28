import Resource from "../models/resource.model.js"
import User from "../models/user.model.js"


export const getStats = async (res)=>{
    const users = await User.find({})
    const resources = await Resource.find({})

    const totalusers = users.length
    const totalresources = resources.length

    res.status(200).json({
        users : totalusers,
        resources : totalresources

    })

}