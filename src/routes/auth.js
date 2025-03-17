const { login, forgetPassword, updatePassword } = require("../services/auth");
const { setUserPassword } = require("../services/users");

const router = require("express").Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  login(email, password)
    .then((result) => res.status(result.status).send(result))
    .catch((error) => {
      sendErrorResp(error, req, res);
    });
});

router.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  forgetPassword(email)
    .then((result) => res.status(result.status).send(result))
    .catch((error) => {
      sendErrorResp(error, req, res);
    });
});

router.post("/update-password", (req, res) => {
  const { password, email } = req.body;
  updatePassword(email, password)
    .then((result) => res.status(result.status).send(result))
    .catch((error) => {
      sendErrorResp(error, req, res);
    });
});

router.post("/set-password", (req, res) => {
  setUserPassword(req.body)
    .then((result) => res.status(result.status).send(result))
    .catch((error) => {
      sendErrorResp(error, req, res);
    });
});

module.exports = router;
