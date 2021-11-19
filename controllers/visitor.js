const Visitor = require("../models/visitors"),
    Host = require("../models/hosts");

module.exports.checkinVisitor = async (req, res) => {
    try {
        const hosts = await Host.find();
        if (hosts.length === 0) {
            req.flash("error", "Sorry, No host is currently available.")
            return res.redirect("/visitor/checkin");
        }
        let visitor = await Visitor.findOne({ email: req.body.email });

        if (!visitor) {
            visitor = await Visitor.create(req.body);
        } else {
            if (visitor.checked_in) {
                req.flash("error", "Visitor is already checked in.");
                return res.redirect("/visitor/checkin");
            }
        }
        let host = await Host.findOne({ name: req.body.selectpicker });
        visitor.host_alloted = host._id;
        host.visitor_count += 1;
        visitor.checked_in = true;
        visitor.check_in_time = new Date(visitor.createdAt).toString();
        await visitor.save();
        await host.save();
        req.flash("success", `Visitor ${visitor.name} checked in`);
        res.redirect("/visitor/checkin");
    } catch(err) {
        req.flash("error", "Couldn't checkin visitor - " + err.message);
        res.redirect("/visitor/checkin");
    }
}