

exports.index = function(req, res){
  res.render('shop', { title: 'Express' });
};

exports.shopdetail = function(req, res){
	  res.render('shopdetail', { title: 'Express' });
	};