const _ = require("lodash");
const router = require("express").Router();

const userRoutes = require("./users");
const authRoutes = require("./auth");
const adminRoutes = require("./admin");
const providerRoutes = require("./providers");
const categroyRoutes = require("./categories");
const { isLoggedIn, isAdmin } = require("../middlewares/auth");

router.use("/users", isLoggedIn, userRoutes);
router.use("/auth", authRoutes);
router.use("/admin", isAdmin, adminRoutes);
router.use("/providers", isLoggedIn, providerRoutes);
router.use("/categories", isLoggedIn, categroyRoutes);

module.exports = router;
