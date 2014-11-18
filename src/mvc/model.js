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

	function Model( attributes, properties ) {
		Object.defineProperty( this, '_attributes', {
			value: {}
		} );

		utils.extend( this, properties );

		this._initAttributes( attributes || {} );
		this.initialize.apply( this, arguments );
	}

	Model.extend = extend;

	utils.extend( Model.prototype, Emitter, {
		define: function( attr, value, options ) {
			Object.defineProperty( this, attr, utils.extend( {
				enumerable: true,

				get: function() {
					return this._attributes[ attr ];
				},

				set: function( value ) {
					var oldValue = this._attributes[ attr ];

					if ( oldValue !== value ) {
						this._attributes[ attr ] = value;
						this.trigger( 'change', this );
						this.trigger( 'change:' + attr, this, value, oldValue );
					}
				}
			}, options ) );

			if ( !utils.isUndefined( value ) ) {
				this._attributes[ attr ] = value;
			}
		},

		initialize: function() {},

		_initAttributes: function( attributes ) {
			Object.keys( attributes ).forEach( function( attr ) {
				this.define( attr, attributes[ attr ] );
			}, this );
		}
	} );

	return Model;
} );
