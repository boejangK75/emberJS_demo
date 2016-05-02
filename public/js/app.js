App = Ember.Application.create({});

/**================================== For priorities combo box =================*/
App.priorities = ["High", "Normal", "Low"];

/**================================== Router MAP (router.js) =================*/
App.Router.map(function() {
//	console.log('######### Router.map');
	
	this.route("index", {
		path : "/"
	});
	this.resource("locations", function() {
//		console.log('######### Router.map --> locations');
		
		this.route("new", {
			path : "/new"
		});
		this.route("edit", {
			path : "/:location_id"
		});
	});
});


/**================================== Model (inside folder --> models) =================*/
App.ApplicationSerializer = DS.RESTSerializer.extend({
	primaryKey : '_id'
});

App.Location = DS.Model.extend({
	name : DS.attr('string'),
	duration : DS.attr('number'),
	priority : DS.attr('string'),
	value : DS.attr('string')
});

/**================================== ROUTES (inside folder --> routes) =================*/
App.LocationsIndexRoute = Ember.Route.extend({
	setupController : function(controller) {
		var locations = this.get('store').find('location');
		console.log('######### LocationsIndexRoute --> setupController, locations : '+JSON.stringify(locations));
		
		controller.set('content', locations);
	},
	renderTemplate : function() {
		console.log('######### LocationsIndexRoute --> renderTemplate');
		
		this.render('locations.index', {
			into : 'application'
		});
	}
});

App.LocationsEditRoute = Ember.Route.extend({
	setupController : function(controller, model) {
		console.log('######### LocationsEditRoute --> setupController');
		
		this.controllerFor('locations.edit').setProperties({
			isNew : false,
			content : model
		});
	},
	renderTemplate : function() {
		console.log('######### LocationsEditRoute --> renderTemplate');
		
		this.render('locations.edit', {
			into : 'application'
		});
	}
});

App.LocationsNewRoute = Ember.Route.extend({
	setupController : function(controller, model) {
		var newLocation = this.store.createRecord('location', {});
		console.log('######### LocationsNewRoute, newLocation : '+JSON.stringify(newLocation));
		
		this.controllerFor('locations.edit').setProperties({
			isNew : true,
			content : newLocation
		});
	},
	renderTemplate : function() {
		console.log('######### LocationsNewRoute --> renderTemplate');
		
		this.render('locations.edit', {
			into : 'application'
		});
	}
});

/**================================== CONTROLLERS (inside folder --> controllers) =================*/
App.LocationsEditController = Ember.ObjectController.extend({
	updateItem : function(location) {
		console.log('######### LocationsEditController --> updateItem, location : '+JSON.stringify(location));
		
		location.save();
		this.get("target").transitionTo("locations");
	},
	isNew : function() {
		console.log('######### LocationsEditController --> isNew');
		
		return this.get('content').get('id');
	}.property()
});

App.LocationsIndexController = Ember.ArrayController.extend({
	editCounter : function() {
		console.log('######### LocationsIndexController --> editCounter');
		
		return this.filterProperty('selected', true).get('length');
	}.property('@each.selected'),

	itemsSelected : function() {
		console.log('######### LocationsIndexController --> itemsSelected');
		
		return this.get("editCounter") > 0;
	}.property('editCounter'),

	removeItem : function(location) {
		console.log('######### LocationsIndexController --> removeItem, location : '+JSON.stringify(location));
		
		location.on("didDelete", this, function() {});
		location.destroyRecord();
	},
	removeSelectedLocations : function() {
		arr = this.filterProperty('selected', true);
		console.log('######### LocationsIndexController --> removeSelectedLocations, arr : '+JSON.stringify(arr));
		
		if (arr.length === 0) {
			output = "nothing selected";
		} else {
			output = "";
			for ( var i = 0; i < arr.length; i++) {
				arr[i].destroyRecord();
			}
		}
	},
	locationsPresent : function() {
		var itemsPresent = this.get('content').get('length') > 0;
		console.log('######### LocationsIndexController --> locationsPresent, itemsPresent : '+JSON.stringify(itemsPresent));
		
		return itemsPresent;
	}.property("content.@each")
});

App.NavView = Ember.View.extend({
	tagName : 'li',
	classNameBindings : [ 'active' ],

	didInsertElement : function() {
//		console.log('######### NavView --> didInsertElement');
		
		this._super();
		this.notifyPropertyChange('active');
		var _this = this;
		this.get('parentView').on('click', function() {
			_this.notifyPropertyChange('active');
		});
	},
	active : function() {
//		console.log('######### NavView --> active');
		
		return this.get('childViews.firstObject.active');
	}.property()
});
