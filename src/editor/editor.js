CKEDITOR.define( [
	'mvc',
	'tools/element',
	'tools/utils'
], function(
	MVC,
	Element,
	utils
) {
	'use strict';

	function Editor( src, options ) {
		options = options || {};
		this.src = src;
		this.$src = new Element( src );

		MVC.Application.call( this, options );
	}

	utils.inherit( Editor, MVC.Application );

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
			this._initPlugins( options.plugins );

			this.trigger( 'before:create' );

			var creator = this.getCreator( options.creator );

			if ( creator ) {
				creator( this );
			}
			this.trigger( 'create' );

			return this;
		},

		_initPlugin: function( name ) {
			// don't add the same plugin twice
			if ( this._plugins[ name ] ) {
				return;
			}

			// TODO this requires adding each plugin to the dependency list in ckeditor.js file,
			// maybe we should re-think this one?
			var plugin = require( 'plugins!' + name );

			if ( !plugin.name ) {
				plugin.name = name;
			}

			if ( plugin.deps ) {
				plugin.deps.forEach( this._initPlugin, this );
			}

			plugin.init( this );
		},

		_initPlugins: function( plugins ) {
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

			plugins.forEach( this._initPlugin, this );
		}
	} );

	return Editor;
} );
