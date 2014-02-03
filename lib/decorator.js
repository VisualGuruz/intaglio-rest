var Intaglio = require('intaglio'),
	RSVP = require('rsvp');

var RestDecorator = {
	serialize: function (serializer) {
		Intaglio.utils.assert('Serializer must be provided!', serializer !== undefined);

		return serializer(this);
	},

	/**
	 * Pretty sure I'm going to remove support for multi column keys as it's just to damn difficult.
	 * @return {String}
	 */
	getSelfLink: function () {
		var pks = [],
			self = this;

		this._model.getPrimaryKey().forEach(function (value) {
			pks.push(self.get(value.getName()));
		});

		return '/api/'+this.getSchema().getPluralizedName()+'/'+pks.join(':');
	},

	getRawData: function () {
		return JSON.parse(JSON.stringify(this._data));
	},


	/**
	 * Hooks
	 *
	 * We're just scaffolding them up here.
	 */
	preGetHook: function () {
		var self = this;

		return RSVP.Promise.cast(this._super.apply(this, arguments)).then(function () {
			return self;
		});
	},

	prePostHook: function () {
		var self = this;

		return RSVP.Promise.cast(this._super.apply(this, arguments)).then(function () {
			return self;
		});
	},

	prePutHook: function () {
		var self = this;

		return RSVP.Promise.cast(this._super.apply(this, arguments)).then(function () {
			return self;
		});
	},

	preDeleteHook: function () {
		var self = this;

		return RSVP.Promise.cast(this._super.apply(this, arguments)).then(function () {
			return self;
		});
	},

	postGetHook: function () {
		var self = this;

		return RSVP.Promise.cast(this._super.apply(this, arguments)).then(function () {
			return self;
		});
	},

	postPostHook: function () {
		var self = this;

		return RSVP.Promise.cast(this._super.apply(this, arguments)).then(function () {
			return self;
		});
	},

	postPutHook: function () {
		var self = this;

		return RSVP.Promise.cast(this._super.apply(this, arguments)).then(function () {
			return self;
		});
	},

	postDeleteHook: function () {
		var self = this;

		return RSVP.Promise.cast(this._super.apply(this, arguments)).then(function () {
			return self;
		});
	}
};

module.exports = RestDecorator;