define( [
	'mvc/extend',
	'mvc/spacemanager',
	'tools/commands',
	'tools/emitter',
	'tools/utils'
], function(
	extend,
	SpaceManager,
	Commands,
	Emitter,
	utils
) {
	'use strict';

	function Application( options, properties ) {
		this.options = options;

		if ( properties ) {
			utils.extend( this, properties );
		}

		this.initialize.apply( this, arguments );
	}

	Application.extend = extend;

	utils.extend( Application.prototype, SpaceManager, Emitter, Commands, {
		destroy: function() {
			this.trigger( 'before:destroy' );
			this._spaceManager.destroy();
			this.trigger( 'destroy' );
		},

		initialize: function() {}
	} );

	return Application;
} );
