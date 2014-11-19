define( [
	'mvc/extend',
	'tools/emitter',
	'tools/utils'
], function(
	extend,
	Emitter,
	utils
) {
	'use strict';

	function Plugin( editor ) {
		this.editor = editor;
	}

	Plugin.extend = extend;

	utils.extend( Plugin.prototype, Emitter, {
		deps: null,
		name: null,
		path: null,

		init: function( done ) {
			done();
		}
	} );

	return Plugin;
} );
