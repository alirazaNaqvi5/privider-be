const {
  getCategoryById,
  getAllCategories,
  updateCategory,
} = require("../services/categories");
const { sendErrorResp } = require("../utils/common-utils");

/* eslint-disable */
const router = require("express").Router();

router.get("/:id", async (req, res) => {
  getCategoryById(req.jwt.id)
    .then((result) => {
      res.status(result.status).send(result);
    })
    .catch((error) => {
      sendErrorResp(error, req, res);
    });
});

router.get("/", async (req, res) => {
  getAllCategories(req.query.page, req.query.limit)
    .then((result) => {
      res.status(result.status).send(result);
    })
    .catch((error) => {
      sendErrorResp(error, req, res);
    });
});

module.exports = router;
