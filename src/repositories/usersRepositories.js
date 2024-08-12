const { models } = require('../models');

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
    createUser,
    updateUser,
    deleteUser
};