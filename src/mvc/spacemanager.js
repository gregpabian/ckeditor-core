define( [
	'mvc/extend',
	'mvc/space',
	'tools/element',
	'tools/emitter',
	'tools/utils'
], function(
	extend,
	Space,
	Element,
	Emitter,
	utils
) {
	'use strict';

	function SpaceManager( options, properties ) {
		this.options = options;

		if ( properties ) {
			utils.extend( this, properties );
		}

		this.initialize.apply( this, arguments );
	}

	SpaceManager.extend = extend;

	utils.extend( SpaceManager.prototype, Emitter, {
		addSpace: function( name, space ) {
			this.trigger( 'before:add:space', name, space );

			if ( !this._spaces ) {
				Object.defineProperty( this, '_spaces', {
					configurable: true,
					value: {}
				} );
			}

			if ( space instanceof Space ) {
				this._spaces[ name ] = space;
			} else if ( space instanceof Element || utils.isElement( space ) ) {
				this._spaces[ name ] = new Space( space );
			}

			this.trigger( 'add:space', name, space );

			return this;
		},

		destroy: function() {
			if ( !this._spaces ) {
				return;
			}

			this.trigger( 'before:destroy' );

			Object.keys( this._spaces ).forEach( function( name ) {
				this.removeSpace( name );
			}, this );

			this.trigger( 'destroy' );

			return this;
		},

		getSpace: function( name ) {
			return this._spaces ? this._spaces[ name ] : null;
		},

		removeSpace: function( name ) {
			var space = this._spaces && this._spaces[ name ];

			if ( !space ) {
				return;
			}

			this.trigger( 'before:remove:space', name, space );

			space.clear();
			space.stopListening();

			delete this._spaces[ name ];

			this.trigger( 'remove:space', name, space );

			return this;
		}
	} );

	return SpaceManager;
} );
