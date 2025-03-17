const { categories } = require("../models");

const createCategory = async (body) => {
  try {
    let whereCaluse = { name: body.name };
    if (body.parent_id) {
      whereCaluse.parent_id = body.parent_id;
    }
    let categoryData = await categories.findOne({
      where: whereCaluse,
    });
    if (categoryData) {
      return {
        status: 403,
        message: "Category with this name already exists",
      };
    }

    await categories.create(categoryData);
    return {
      status: 200,
      message: "Category Created",
    };
  } catch (err) {
    console.log("___error", err.message);
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};

const getCategoryById = async (id) => {
  try {
    let categoryData = await categories.findOne({
      where: { id },
    });
    if (!categoryData) {
      return {
        status: 404,
        message: "Category does not exists",
      };
    }

    return {
      status: 200,
      message: "Category Found",
      data: categoryData,
    };
  } catch (err) {
    console.log("___error", err.message);
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};

const getAllCategories = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows: categoryData } = await categories.findAndCountAll({
      attributes: { exclude: ["password"] },
      limit,
      offset,
    });

    if (count === 0) {
      return {
        status: 404,
        message: "No categories found",
      };
    }

    return {
      status: 200,
      data: categoryData,
      pagination: {
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        pageSize: limit,
      },
      message: "Categories retrieved successfully",
    };
  } catch (err) {
    console.error("___error", err.message);
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};

const updateCategory = async (id, body) => {
  try {
    const categoryData = await categories.findOne({ where: { id } });
    let matchData = null;
    if (!categoryData) {
      return {
        status: 404,
        message: "Category does not exists",
      };
    }
    if (body.parent_id) {
      matchData = await categories.findOne({
        where: { parent_id: body.parent_id, name: categoryData.name },
      });
    }
    if (matchData) {
      return {
        status: 403,
        message: "Category with this name Already exists",
      };
    } else {
      await categories.update(body, { where: { id } });
      return {
        status: 200,
        data: categoryData,
        message: "Categories updated successfully",
      };
    }
  } catch (err) {
    console.error("___error", err.message);
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};

const deleteCategory = async (id) => {
  try {
    const categoryData = await categories.findOne({ where: { id } });
    if (!categoryData) {
      return {
        status: 404,
        message: "Category does not exists",
      };
    }
    await categories.destroy({ where: { id } });
  } catch (err) {
    console.error("___error", err.message);
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};
module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
