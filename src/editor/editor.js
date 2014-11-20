CKE.define( [
	'mvc/application',
	'tools/element',
	'tools/utils',
	'require'
], function(
	Application,
	Element,
	utils,
	require
) {
	'use strict';

	function Editor( src, options ) {
		options = options || {};
		this.src = src;
		this.$src = new Element( src );
		this.created = false;

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

				// create a UI for this Editor instance
				if ( creator ) {
					creator.create();
				}

				this.created = true;
				this.trigger( 'create', this );
			}.bind( this ) );

			return this;
		},

		_initPlugins: function( plugins, done ) {
			var fnParamPattern = /\(([^\)]*)/,
				that = this;

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

			// counts a number of parameters expected by a plugin's "init" function.
			function needsParams( fn ) {
				var params = fnParamPattern.exec( fn.toString() );

				return params && !!params[1];
			}

			function next() {
				var data = plugins.shift();

				if ( !data ) {
					return done();
				}

				if ( utils.isString( data ) ) {
					data = {
						name: data
					};
				}

				CKE.require( [ 'plugins!' + data.name ], function( Plugin ) {
					var plugin;

					function loaded() {
						// if "plugin.init" requires a parameter, it means the "init"
						// function might be asynchronous and want's to trigger "done" callback
						if ( needsParams( plugin.init ) ) {
							plugin.init.call( plugin, next );
						} else {
							plugin.init.call( plugin );
							next();
						}
					}

					// don't re-initialize
					if ( that._plugins[ data.name ] ) {
						return next();
					}

					that._plugins[ data.name ] = plugin = new Plugin( that );

					// inject plugin's name
					if ( !plugin.name ) {
						plugin.name = data.name;
					}

					// inject plugin's path
					if ( !plugin.path ) {
						plugin.path = data.path || CKE.getPluginPath( data.name );
					}

					// load and initialize plugin's dependencies
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
