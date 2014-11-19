CKE.define( [
	'editor/editor',
	'tools/emitter',
	'tools/utils'
], function(
	Editor,
	Emitter,
	utils
) {
	'use strict';

	var basePathSrcPattern = /(^|.*[\\\/])ckeditor\.js(?:\?.*|;.*)?$/i,
		ckeditor = utils.extend( {}, Emitter );

	// holds references to all Editor instances
	ckeditor.instances = {};

	// CKEditor base path, based on CKE4 code
	ckeditor.basePath = ( function() {
		var scripts = document.getElementsByTagName( 'script' ),
			path;

		[].some.call( scripts, function( script ) {
			var match = script.src.match( basePathSrcPattern );

			if ( match ) {
				path = match[ 1 ];
				return true;
			}
		} );

		if ( path.indexOf( ':/' ) == -1 && path.slice( 0, 2 ) != '//' ) {
			if ( path.indexOf( '/' ) === 0 ) {
				path = location.href.match( /^.*?:\/\/[^\/]*/ )[ 0 ] + path;
			} else {
				path = location.href.match( /^[^\?]*\/(?:)/ )[ 0 ] + path;
			}
		}

		return path;
	} )();

	// create an editor instance
	ckeditor.create = function( selector, options ) {
		var editor = null,
			element;

		if ( utils.isString( selector ) ) {
			element = document.querySelectorAll( selector );

			if ( element.length > 1 ) {
				editor = [].map.call( element, function( el ) {
					var instance = ckeditor.instances[ 'editor_' + utils.uid( 'e' ) ] = new Editor( el, options );

					return instance;
				} );
			} else if ( element.length === 1 ) {
				editor = ckeditor.instances[ 'editor_' + utils.uid( 'e' ) ] = new Editor( element[ 0 ], options );
			}
		}

		this.trigger( 'instance:create', editor );

		return editor;
	};

	// build a full path to a plugin's resource directory
	ckeditor.getPluginPath = function( name ) {
		return ckeditor.basePath + 'plugins/' + name + '/';
	};

	return ckeditor;
} );
