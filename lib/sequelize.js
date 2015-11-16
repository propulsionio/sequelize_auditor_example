/**
 * Author: Raeesaa Metkari
 *  
 */

var Sequelize = require('sequelize');
var mysql = require('mysql');

var sequelize = new Sequelize("chorus_auditor", "root", "root", {
	host: "127.0.0.1",
	dialect: "mysql",
	pool: {
		min: 0,
		max: 5,
		idle: 10000
	}
});

var Funder = sequelize.define('funder', {
	funderId: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		field: "funder_id" //Field will be named as funder_id in the database table and not funderId
	},
	funderName: {
		type: Sequelize.STRING,
		primaryKey: true,
		field: "funder_name"
	},
	funderParentId: {
		type: Sequelize.INTEGER,
		field: "funder_parent_id"
	}
});

var DOI = sequelize.define('doi', {
	DOI: {
		type: Sequelize.STRING,
		primaryKey: true
	},
	ISSN: Sequelize.STRING,
	URL: Sequelize.STRING,
	currentDate: {
		type: Sequelize.DATE,
		field: "current_date"
	},
	depositedDate: {
		type: Sequelize.DATE,
		field: "deposited_date"
	},
	depositTimestamp: {
		type: Sequelize.DATE,
		field: "deposit_timestamp"
	},
	indexedDate: {
		type: Sequelize.DATE,
		field: "indexed_date"
	},
	indexTimestamp: {
		type: Sequelize.DATE,
		field: "index_timestamp"
	},
	active: {
		type: Sequelize.BOOLEAN,
		defaultValue: true
	},
	issue: Sequelize.INTEGER,
	issueDate: {
		type: Sequelize.DATE,
		field: "issue_date"
	},
	volume: Sequelize.INTEGER,
	member: Sequelize.STRING(50),
	page: Sequelize.INTEGER,
	prefix: Sequelize.STRING,
	source: Sequelize.STRING,
	title: Sequelize.STRING,
	subtitle: Sequelize.STRING,
	type: Sequelize.STRING,
	journalName: {
		type: Sequelize.STRING,
		field: "journal_name"
	},
	updateDate: {
		type: Sequelize.DATE,
		field: "update_date"
	},
	publicationDate: {
		type: Sequelize.DATE,
		field: "publication_date"
	}
});

//many-to-many association collection 
var DoiFunder = sequelize.define("doi_funder", {
	award: Sequelize.STRING,
	name: Sequelize.STRING,
	funderDOI: {
		type: Sequelize.STRING,
		field: "funder_doi"
	}
});

//n:m or many-to-many associations in Sequelize use "ON_DELETE_CASCADE" be default 
//Therefore, we dont need to pass on delete cascade as an option to association
DOI.belongsToMany(Funder, {through: DoiFunder});
Funder.belongsToMany(DOI, {through: DoiFunder});

sequelize.sync().catch(function(err){
	console.log(err)
});

module.exports = {
	Funder: Funder,
	DOI: DOI,
	DoiFunder: DoiFunder
}
