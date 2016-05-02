exports.page500 = function(req, res){
	var errormsg = req.session.error;
    delete req.session.error;
    res.render("500", {errormark: errormsg});
};