define( [ 'tools/utils' ], function( utils ) {
	'use strict';

	return function( proto, statics ) {
		var parent = this,
			child = proto.hasOwnProperty( 'constructor' ) ?
			proto.constructor :
			function() {
				parent.apply( this, arguments );
			};

		utils.extend( child, parent, statics || {} );

		child.prototype = Object.create( parent.prototype );
		utils.extend( child.prototype, proto );

		return child;
	};
} );
