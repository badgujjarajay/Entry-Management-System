const Host = require("../models/hosts");

module.exports.addHost = async (req, res) => {
    try {
        const newHost = await Host.create(req.body);
        req.flash("success", `New host ${newHost.name} has been registered!`);
        res.redirect("/host");
    } catch (err){
        req.flash("error", "New host couldn't be registered -  " + err.message);
        res.redirect("/host");
    }
}