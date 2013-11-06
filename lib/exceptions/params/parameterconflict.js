var ParameterConflictException = function (message, constructor) {
	Error.captureStackTrace(this, constructor || this);
	this.message = message || 'Duplicate parameters are not allowed!';
};

util.inherits(ParameterConflictException, Error);
ParameterConflictException.prototype.name = 'ParameterConflictException';