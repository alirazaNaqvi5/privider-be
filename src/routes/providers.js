const {
  getProviderDataById,
  getAllProviders,
} = require("../services/providers");
const { sendErrorResp } = require("../utils/common-utils");

/* eslint-disable */
const router = require("express").Router();

router.post("/:id", async (req, res) => {
  getProviderDataById(req.params.id)
    .then((result) => {
      res.status(result.status).send(result);
    })
    .catch((error) => {
      sendErrorResp(error, req, res);
    });
});

router.get("/", async (req, res) => {
  getAllProviders(req.query.page, req.query.limit)
    .then((result) => {
      res.status(result.status).send(result);
    })
    .catch((error) => {
      sendErrorResp(error, req, res);
    });
});

module.exports = router;
