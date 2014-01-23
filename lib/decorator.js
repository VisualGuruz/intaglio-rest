var Intaglio = require('intaglio');

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
	}
};

module.exports = RestDecorator;