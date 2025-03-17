const { updateUser } = require("../services/admin");
const { getUserById, setUserPassword, deleteUserById } = require("../services/users");
const { sendErrorResp } = require("../utils/common-utils");

/* eslint-disable */
const router = require("express").Router();

router.get("/", async (req, res) => {
  getUserById(req.jwt.id)
    .then((result) => {
      res.status(result.status).send(result);
    })
    .catch((error) => {
      sendErrorResp(error, req, res);
    });
});

router.patch("/", async (req, res) => {
  updateUser(req.body, req.jwt.id)
    .then((result) => {
      res.status(result.status).send(result);
    })
    .catch((error) => {
      sendErrorResp(error, req, res);
    });
});

router.post("/set-pass", async (req, res) => {
  setUserPassword(req.body)
    .then((result) => {
      res.status(result.status).send(result);
    })
    .catch((error) => {
      sendErrorResp(error, req, res);
    });
});

router.delete("/delete/:id", async (req, res) => {
  const userDeleteId = req.params.id;
  if (req.jwt.role !== "admin" && req.jwt.id !== userDeleteId) {
    return res.status(403).send({
      status: 403,
      message: "You are not authorized to delete this user",
    });
  }
  deleteUserById(userDeleteId)
    .then((result) => {
      res.status(result.status).send(result);
    })
    .catch((error) => {
      sendErrorResp(error, req, res);
    });
});

module.exports = router;
