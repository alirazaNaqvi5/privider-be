const {
  getAllUsers,
  createUser,
  updateUser,
  updateUserByAdmin,
  deleteUserById,
} = require("../services/admin");
const {
  deleteCategory,
  createCategory,
  updateCategory,
} = require("../services/categories");
const {
  getProviderDataById,
  createProvider,
  deleteProvider,
  updateProvider,
} = require("../services/providers");
const { getUserById, setUserPassword } = require("../services/users");
const { sendErrorResp } = require("../utils/common-utils");

/* eslint-disable */
const router = require("express").Router();

router.get("/users/:id", async (req, res) => {
  getUserById(req.params.id)
    .then((result) => {
      res.status(result.status).send(result);
    })
    .catch((error) => {
      sendErrorResp(error, req, res);
    });
});

router.delete("/users/:id", async (req, res) => {
  deleteUserById(req.params.id)
    .then((result) => {
      res.status(result.status).send(result);
    })
    .catch((error) => {
      sendErrorResp(error, req, res);
    });
}
);

router.get("/providers/:id", async (req, res) => {
  getProviderDataById(req.params.id)
    .then((result) => {
      res.status(result.status).send(result);
    })
    .catch((error) => {
      sendErrorResp(error, req, res);
    });
});

router.get("/", async (req, res) => {
  getUserById(req.jwt.id)
    .then((result) => {
      res.status(result.status).send(result);
    })
    .catch((error) => {
      sendErrorResp(error, req, res);
    });
});

router.post("/users", async (req, res) => {
  createUser(req.body)
    .then((result) => {
      res.status(result.status).send(result);
    })
    .catch((error) => {
      sendErrorResp(error, req, res);
    });
});
router.post("/categories", async (req, res) => {
  createCategory(req.body)
    .then((result) => {
      res.status(result.status).send(result);
    })
    .catch((error) => {
      sendErrorResp(error, req, res);
    });
});

router.patch("/categories/:id", async (req, res) => {
  updateCategory(req.params.id, req.body)
    .then((result) => {
      res.status(result.status).send(result);
    })
    .catch((error) => {
      sendErrorResp(error, req, res);
    });
});

router.post("/providers", async (req, res) => {
  createProvider(req.body)
    .then((result) => {
      res.status(result.status).send(result);
    })
    .catch((error) => {
      sendErrorResp(error, req, res);
    });
});

router.get("/users", async (req, res) => {
  getAllUsers(req.query.page, req.query.limit)
    .then((result) => {
      res.status(result.status).send(result);
    })
    .catch((error) => {
      sendErrorResp(error, req, res);
    });
});

router.patch("/users/:id", async (req, res) => {
  updateUserByAdmin(req.body, req.params.id)
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

router.patch("/providers/:id", async (req, res) => {
  updateProvider(req.body, req.params.id)
    .then((result) => {
      res.status(result.status).send(result);
    })
    .catch((error) => {
      sendErrorResp(error, req, res);
    });
});

router.delete("/providers/:id", async (req, res) => {
  deleteProvider(req.params.id)
    .then((result) => {
      res.status(result.status).send(result);
    })
    .catch((error) => {
      sendErrorResp(error, req, res);
    });
});

router.delete("/categories/:id", async (req, res) => {
  deleteCategory(req.params.id)
    .then((result) => {
      res.status(result.status).send(result);
    })
    .catch((error) => {
      sendErrorResp(error, req, res);
    });
});
module.exports = router;
