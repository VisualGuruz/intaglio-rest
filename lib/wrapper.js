var Intaglio = require('intaglio');

var DataWrapper = Intaglio.wrappers.abstract.extend({
	init: function (object) {
		this._object = object;
	},

	serialize: function (serializer) {
		Intaglio.utils.assert('Serializer must be provided!', serializer !== undefined);

		return serializer(this);
	},

	/**
	 * Pretty sure I'm going to remove support for multi column keys as it's just to damn difficult.
	 * @return {[type]} [description]
	 */
	getSelfLink: function () {
		var pks = [],
			self = this;

		this._object.getPrimaryKey().forEach(function (value) {
			pks.push(self.get(value));
		});

		return '/api/'+this._object.getSchema().getPluralizedName()+'/'+pks.join(':');
	}
});

module.exports = DataWrapper;