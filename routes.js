/**
 *  Author: Raeesaa Metkari
 * 
 */

var async = require('async');
var _ = require('lodash');

var models = require('./lib/sequelize');

module.exports = function(app) {
	app.get('/', function(req, res, next) {
		return res.render('index', {title: "Sequelize Demo"});
	});
	
	app.get('/add_funders', function(req, res, next) {
		return res.render('add_funder', {title: "Sequelize Demo"});
	});
	
	app.get('/view_funders', function(req, res, next) {
		
		models.Funder.findAll()
		.then(function(funders) {
			return res.render('list_funders', {title: "Sequelize Demo", funders: funders});
		}).catch(function(err) {
			return next(err);
		});
		
	})
	
	app.post('/funders', function(req, res, next) {
		
		models.Funder.create(req.body)
		.then(function(funder) {
			return res.redirect('/view_funders');
		})
		.catch(function(err) {
			return next(err);
		})
	});
	
	app.get('/edit_funders/:id', function(req, res, next) {
		
		models.Funder.findOne({
			where: {
				funderId: req.params.id
			}
		}). then(function(funder) {
			return res.render('add_funder', {title: "Sequelize Demo", funder: funder});						
		}).catch(function(err) {
			return next(err);
		});
	});
	
	app.get('/delete_funders/:id', function(req, res, next) {
		
		models.Funder.destroy({
			where: {
				funderId: req.params.id
			}
		}). then(function(funder) {
			return res.redirect('/view_funders');						
		}).catch(function(err) {
			return next(err);
		});
	});
	
	app.post('/edit_funders/:id', function(req, res, next) {
		
		models.Funder.update(req.body, {
			where: {
				funderId: req.params.id
			}
		}).then(function() {
			return res.redirect('/view_funders');
		}).catch(function(err) {
			return next(err);
		});		
	});
	
	app.get('/add_dois', function(req, res, next) {
		return res.render('add_doi', {title: "Sequelize Demo"});
	})
	
	app.post('/dois', function(req, res, next) {
		
		models.DOI.create(req.body)
		.then(function(doi) {
			return res.redirect('/view_dois');
		}).catch(function(err) {
			return next(err);
		});		
	});
	
	app.get('/view_dois', function(req, res, next) {
		
		models.DOI.findAll()
		.then(function(dois) {
			return res.render('list_dois', {title: "Sequelize Demo", dois: dois})
		})
		.catch(function(err) {
			return next(err);
		})
		
	});
	
	app.get('/dois/:prefix/:doi/detailed_view', function(req, res, next) {
		
		var doi = req.params.prefix + '/' + req.params.doi;
		
		models.DOI.findOne({
			where: {
				DOI: doi
			},
			include: [models.Funder]
		})
		.then(function(doi) {
			return res.render('doi_detailed_view', {DOI: doi, title: "Sequelize Demo"});
			//return res.json(doi);
		}).catch(function(err) {
			return next(err);
		});		
	})
	
	app.get('/edit_dois/:prefix/:doi', function(req, res, next) {
		
		var doi = req.params.prefix + '/' + req.params.doi;
		
		models.DOI.findOne({
			where: {
				DOI: doi
			}
		})
		.then(function(doi) {
			//return res.json(doi);
			return res.render('add_doi', {title: "Sequelize Demo", doi: doi})
		}).catch(function(err) {
			return next(err);
		});	
	});
	
	app.post('/edit_dois/:prefix/:doi', function(req, res, next) {
		
		var doi = req.params.prefix + '/' + req.params.doi;
		
		models.DOI.update(req.body, {
			where: {
				DOI: doi
			}
		})
		.then(function(doi) {
			return res.redirect('/view_dois');
		}).catch(function(err) {
			return next(err);
		});
		
	});
	
	app.get('/delete_dois/:prefix/:doi', function(req, res, next) {
		
		var doi = req.params.prefix + '/' + req.params.doi;
		
		models.DOI.destroy({
			where: {
				DOI: doi
			}
		}).then(function() {
			return res.redirect('/view_dois');			
		}).catch(function(err) {
			return next(err);
		});
		
	});
	

	app.get('/get_dois', function(req, res, next) {
		
		models.DOI.findAll({
			attributes: ['DOI']
		})
		.then(function(dois) {
			return res.json(dois);
		})
		.catch(function(err) {
			return next(err);
		});		
	});
	
	app.get('/get_funders', function(req, res, next) {
		
		models.Funder.findAll({
			attributes: ['funderId', 'funderName']
		})
		.then(function(funders) {
			return res.json(funders);
		})
		.catch(function(err) {
			return next(err);
		});		
	});
	
	app.get('/associate_funders', function(req, res, next) {
		return res.render('associate_funders', {title: "Sequelize Demo"});		
	});
	
	app.post('/associate_funders', function(req, res , next) {

		async.parallel({
			doi: function(callback) {
				models.DOI.findOne({
					where: {
						DOI: req.body.DOI
					}
				})
				.then(function(doi) {
					callback(null, doi);		
					
				}).catch(function(err) {
					callback(err);
				});			
			},
			funder: function(callback){
				models.Funder.findOne({
					where: {
						funderId: req.body.funderId
					}
				})
				.then(function(funder) {
					callback(null, funder);
					
				}).catch(function(err) {
					callback(err);
				});	
			}
		}, function(err, result) {
			
			result.doi.addFunders(result.funder, {name: req.body.name, award: req.body.award, funderDOI: req.body.funderDOI})
			.then(function(doc) {
				return res.render('associate_funders', {DOI: req.body.DOI, title: "Sequelize Demo", message: "Funder associated successfully!"});				
			})
			.catch(function(err) {
				return next(err);
			});
		});	
		
	});
}
