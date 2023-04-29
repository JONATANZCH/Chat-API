const uuid = require('uuid');
const Conversations = require('../models/conversations.models');
const Users = require('../models/users.models');
const Participants = require('../models/participants.models');

const findAllConversations = async () => {
    const conversations = await Conversations.findAll()
    return conversations
}
  
const findConversationById = async (id) => {
    const data = await Conversations.findOne({
      where: {
        id: id
      }
    })
    return data
}

const createConversation = async (conversationsObj) => {
    const userGuest =  await Users.findOne({
        where: {
            id: conversationsObj.guestId
        }
    });

    if(!userGuest) return false 

    const newConversations = await Conversations.create({
        id: uuid.v4(),
        name: conversationsObj.name,
        profileImage: conversationsObj.profileImage,
        isGroup: conversationsObj.isGroup,
    })
    // Owner 
    await Participants.create({
        id: uuid.v4(),
        userId: conversationsObj.ownerId,
        conversationId: newConversations.id,
        isAdmin: true
    })
    // Guest 
    await Participants.create({
        id: uuid.v4(),
        userId: conversationsObj.guestId,
        conversationId: newConversations.id,
        isAdmin: true
    })
    return newConversations
}; 


module.exports = {
    createConversation
}
