const { models } = require('../models');
const { Op } = require('../config/database');
const getAllUsers = async () => {
    return await models.User.findAll({
        include: [models.Role]
    });
};

const getUserById = async (id) => {
    return await models.User.findByPk(id), {
        include: [models.Role]
    };
};

const getAllClientUsers = async () => {
    return await models.User.findAll({
    where: {
        idRole: {
        [Op.is]: 2
        }
    }
    })
};

const getAllEmployeeUsers = async () => {
    return await models.User.findAll({
    where: {
        idRole: {
        [Op.is]: 3
    }
    }
    })
};

const createUser = async (data) => {
    return await models.User.create(data);
};

const updateUser = async (id, data) => {
    return await models.User.update(data, {
        where: { id }
    });
};

const deleteUser = async (id) => {
    return await models.User.destroy({
        where: { id }
    });
};

module.exports = {
    getAllUsers,
    getUserById,
    getAllClientUsers,
    getAllEmployeeUsers,
    createUser,
    updateUser,
    deleteUser
};