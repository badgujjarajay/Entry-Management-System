const router = require("express").Router();
const { getRenderData } = require("../controllers/utils");

router.get("/login", async (req, res) => {
    res.render("admin_login");
});

router.get("/add", async (req, res) => {
    res.render("add_admin", getRenderData(req));
});

module.exports = router;