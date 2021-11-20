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

module.exports.checkoutVisitor = async (req, res) => {
    try {
        const visitor = await Visitor.findOne({ email: req.body.email, checked_in: true }).populate("host_alloted");
        if (!visitor) {
            req.flash("error", "The visitor is not checked-in");
            return res.redirect("/visitor/checkout");
        }
        const host = await Host.findById(visitor.host_alloted);
        if (!host) {
            req.flash("error", "The host cannot be found");
            return res.redirect("/visitor/checkout");
        }
        visitor.check_out_time = new Date().toString();
        visitor.checked_in = false;
        host.visitor_count -= 1;

        await visitor.save();
        await host.save();
        req.flash(
            "success",
            `${visitor.name} checked out at ${visitor.check_out_time}`
        );
        res.redirect("/visitor/checkout");
    } catch (err) {
        req.flash("error", "Couldn't checkout visitor - " + err.message);
        res.redirect("/visitor/checkout");
    }
}