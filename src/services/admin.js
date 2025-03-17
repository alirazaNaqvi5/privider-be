const { users } = require("../models");
const { parseEmailsData } = require("../utils/mail-service");

const createUser = async (body) => {
  try {
    const userData = await users.findOne({ where: { email: body.email } });
    if (userData) {
      return {
        status: 403,
        message: "User with this email is already registerd",
      };
    }
    if (body.role === "super_admin") {
      return {
        status: 403,
        message: "Invalid Role",
      };
    }
    if (body.role !== "admin" && body.role !== "user") {
      return {
        status: 403,
        message: "Invalid Role",
      };
    }
    await parseEmailsData({
      data: [
        {
          to: [body.email],
          from: "providersearch0@gmail.com",
          subject: `Congratulations!. Your Account has been created on Provider Search`,
          template: `create-user.html`,
          data: {
            link: `${process.env.SET_PASSWORD_LINK}?email=${body.email}`,
          },
        },
      ],
    });
    await users.create(body);

    return {
      status: 200,
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

const getAllUsers = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows: userData } = await users.findAndCountAll({
      attributes: { exclude: ["password"] },
      limit,
      offset,
    });

    if (count === 0) {
      return {
        status: 404,
        message: "No users found",
      };
    }

    return {
      status: 200,
      data: userData,
      pagination: {
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        pageSize: limit,
      },
      message: "Users retrieved successfully",
    };
  } catch (err) {
    console.error("___error", err.message);
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};

const updateUserByAdmin = async (body, id) => {
  try {
    const userData = await users.findOne({ where: { id } });
    if (!userData) {
      return {
        status: 404,
        message: "User not found",
      };
    }

    // Check if user role is admin or super_admin
    if (userData.role === "admin" || userData.role === "super_admin") {
      return {
        status: 403,
        message: "You cannot update admin or super_admin users",
      };
    }

    // If the user is not admin or super_admin, proceed with the update
    await users.update(body, {
      where: { id },
    });

    return {
      status: 200,
      message: "User updated successfully",
    };
  } catch (err) {
    console.log("__err", err);
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};
const bcrypt = require("bcrypt");

const updateUser = async (body, userId) => {
  try {
    // First check if the user exists
    const userData = await users.findOne({ where: { id: userId } });
    if (!userData) {
      return {
        status: 404,
        message: "User not found",
      };
    }

    // Create a copy of the body to avoid modifying the original
    let updatedData = { ...body };
    delete updatedData.role;
    delete updatedData.active;

    // Check if password field exists in the body
    if (updatedData.password) {
      // Hash the password with bcrypt using salt rounds 10
      const hashedPassword = await bcrypt.hash(updatedData.password, 10);

      // Replace the plain text password with the hashed one
      updatedData.password = hashedPassword;
    }

    // Update the user with the (potentially) modified data
    await users.update(updatedData, {
      where: { id: userId },
    });

    return {
      status: 200,
      message: "User updated successfully",
    };
  } catch (err) {
    console.log("__err", err);
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};

const deleteUserById = async (id) => {
  try {
    const userData = await users.findOne({ where: { id } });
    if (!userData) {
      return {
        status: 404,
        message: "User not found",
      };
    }

    await users.destroy({ where: { id } });

    return {
      status: 200,
      message: "User deleted successfully",
    };
  } catch (err) {
    console.log("__err", err);
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};


module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  updateUserByAdmin,
  deleteUserById,
};
