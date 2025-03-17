const { users } = require("../models");
const bcrypt = require("bcrypt");
const { updateUser } = require("./admin");

const setUserPassword = async (body) => {
  try {
    const userData = await users.findOne({ where: { email: body.email } });
    if (!userData) {
      return {
        status: 404,
        message: "User not found",
      };
    }

    const hashedPass = await bcrypt.hash(body.password, 10);
    if (userData.password) {
      return {
        status: 403,
        message: "User password is already set",
      };
    }
    await users.update(
      { password: hashedPass },
      { where: { email: body.email } }
    );
    return {
      status: 200,
      message: "Password updated Successfully",
    };
  } catch (err) {
    console.log("___error", err.message);
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};

const getUserById = async (id) => {
  try {
    const userData = await users.findByPk(id);
    if (!userData) {
      return {
        status: 404,
        message: "User not found",
      };
    }
    delete userData.dataValues.password;

    return {
      status: 200,
      data: userData,
      message: "User registered Successfully",
    };
  } catch (err) {
    console.log("___error", err.message);
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};

const deleteUserById = async (id) => {
  try {
    const userData = await users.findByPk(id);
    if (!userData) {
      return {
        status: 404,
        message: "User not found",
      };
    }
    await users.destroy({ where: { id } });

    return {
      status: 200,
      message: "User deleted Successfully",
    };
  } catch (err) {
    console.log("___error", err.message);
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};

module.exports = {
  setUserPassword,
  getUserById,
  updateUser,
  deleteUserById,
};
