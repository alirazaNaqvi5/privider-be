const { users } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { parseEmailsData, sendEmail } = require("../utils/mail-service");
const { updateUser } = require("./admin");

const login = async (email, password) => {
  try {
    let userData = await users.findOne({
      where: { email },
      attributes: { exclude: ["created_at", "updated_at"] },
    });
    if (!userData) {
      return {
        status: 404,
        message: "Account with this  email does not exists",
      };
    }

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return {
        status: 403,
        message: "Invalid Password",
      };
    }
    delete userData.dataValues.password;
    let token = jwt.sign(
      { ...userData.dataValues },
      process.env.JWT_SECRET
      // { expiresIn: "12h" }
    );
    return {
      status: 200,
      message: "Authentication  Successfull",
      userData: userData,
      role: userData.role,
      token,
    };
  } catch (err) {
    console.log("___error", err.message);
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};

const forgetPassword = async (email) => {
  try {
    let userData = await users.findOne({
      where: { email },
    });
    if (!userData) {
      return {
        status: 404,
        message: "Account with this  email does not exists",
      };
    }
    const resetCode = Math.floor(10000 + Math.random() * 90000);
    const subject = " Your Password Reset Link for Provider Search";
    const html = ` <p>
   You have requested to reset your
   password for Provider Search. To
   create a new password use this code ${resetCode}.
 </p>
 <p>
   If you need any assistance, please
   contact our support team at
   providersearch0@gmail.com.
 </p>`;
    await users.update({ oto: resetCode }, { where: { email } });
    await sendEmail(email, process.env.FROM, subject, html);
    return {
      status: 200,
      message: "Reset password requested Successfully",
    };
  } catch (err) {
    console.log("___error", err.message);
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};

const updatePassword = async (email, password, otp) => {
  try {
    let userData = await users.findOne({
      where: { email },
    });
    if (!userData) {
      return {
        status: 404,
        message: "Account with this  email does not exists",
      };
    }
    if (userData.otp != otp) {
      return {
        status: 403,
        message: "Otp is invalid",
      };
    }
    const hashedPassword = bcrypt.hash(password, 10);
    await users.update({ password: hashedPassword }, { where: { email } });
    return {
      status: 200,
      message: "Password updated  Successfull",
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
  login,
  forgetPassword,
  updatePassword,
  updateUser,
};
