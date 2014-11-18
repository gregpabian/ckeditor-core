define( [
	'mvc/extend',
	'tools/element',
	'tools/emitter',
	'tools/utils'
], function(
	extend,
	Element,
	Emitter,
	utils
) {
	'use strict';

	function Space( options, properties ) {
		if ( options instanceof Element || utils.isElement( options ) ) {
			this.options = {};
			this.setEl( options );
		} else {
			this.options = options;
		}

		if ( properties ) {
			utils.extend( this, properties );
		}

		this.initialize.apply( this, arguments );
	}

	Space.extend = extend;

	utils.extend( Space.prototype, Emitter, {
		clear: function() {
			var view = this.currentView;

			if ( !view ) {
				return this;
			}

			this.trigger( 'before:clear', view );
			if ( !view.isDestroyed ) {
				view.destroy();
			}
			this.trigger( 'clear', view );

			delete this.currentView;

			return this;
		},

		initialize: function() {},

		setEl: function( el ) {
			if ( el instanceof Element ) {
				this.$el = el;
				this.el = this.$el._el;
			} else if ( utils.isElement( el ) ) {
				this.el = el;
				this.$el = new Element( el );
			}
		},

		show: function( view ) {
			this.trigger( 'before:show', view );

			if ( this.currentView ) {
				this.clear();
			}

			view.once( 'destroy', this.clear, this );
			view.render();
			this._setContent( view.el );

			this.currentView = view;

			this.trigger( 'show', view );

			return this;
		},

		_setContent: function( el ) {
			this.$el.html( '' ).append( el );
		}
	} );

	return Space;
} );
