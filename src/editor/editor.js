CKEDITOR.define( [
	'mvc/application',
	'tools/element',
	'tools/utils'
], function(
	Application,
	Element,
	utils
) {
	'use strict';

	function Editor( src, options ) {
		options = options || {};
		this.src = src;
		this.$src = new Element( src );
		this.isCreated = false;

		Application.call( this, options );
	}

	utils.inherit( Editor, Application );

	utils.extend( Editor.prototype, {
		addCreator: function( name, createFunction ) {
			if ( !this._creators ) {
				Object.defineProperty( this, '_creators', {
					value: {}
				} );
			}

			this._creators[ name ] = createFunction;
		},

		getCreator: function( name ) {
			var creator = null;

			// has creators
			if ( this._creators && Object.keys( this._creators ).length ) {
				// use selected creator
				if ( name in this._creators ) {
					creator = this._creators[ name ];
					// use the first available creator
				} else {
					creator = this._creators[ Object.keys( this._creators )[ 0 ] ];
				}
			}

			return creator;
		},

		initialize: function( options ) {
			this.trigger( 'before:create', this );

			this._initPlugins( options.plugins, function() {
				var creator = this.getCreator( options.creator );

				if ( creator ) {
					creator( this );
				}

				this.isCreated = true;
				this.trigger( 'create', this );
			}.bind( this ) );

			return this;
		},

		_initPlugins: function( plugins, done ) {
			var that = this;

			if ( !plugins ) {
				return;
			}

			if ( !this._plugins ) {
				Object.defineProperty( this, '_plugins', {
					value: {}
				} );
			}

			if ( utils.isString( plugins ) ) {
				plugins = plugins.split( ',' );
			}

			var fnParamPattern = /\(([^\)]+)/;

			function countParam( fn ) {
				var params = fnParamPattern.exec( fn.toString() );

				params = params[ 1 ] ? params[ 1 ].replace( /\s*/g, '' ).split( ',' ).length : 0;

				return params;
			}

			function next() {
				var name = plugins.shift();

				if ( !name ) {
					return done();
				}

				require( [ 'plugins!' + name ], function( plugin ) {
					that._plugins[ name ] = plugin;

					function loaded() {
						if ( countParam( plugin.init ) > 1 ) {
							plugin.init( that, next );
						} else {
							plugin.init( that );
							next();
						}
					}

					if ( plugin.deps ) {
						that._initPlugins( utils.clone( plugin.deps ), loaded );
					} else {
						loaded();
					}
				} );
			}

			next();
		}
	} );

	return Editor;
} );
