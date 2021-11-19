
module.exports.getRenderData = (req) => {
  return {
    success: req.flash("success"),
    error: req.flash("error")
  }
}