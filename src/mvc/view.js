define( [
	'mvc/extend',
	'mvc/model',
	'tools/bob',
	'tools/element',
	'tools/emitter',
	'tools/utils',
], function(
	extend,
	Model,
	Bob,
	Element,
	Emitter,
	utils
) {
	'use strict';

	function View( options ) {
		this.options = options || {};

		if ( options instanceof Model ) {
			options.model = options;
		}

		if ( options && options.model ) {
			this.model = options.model;
		}

		if ( options && options.el ) {
			this.el = options.el;
		}

		this.initialize.apply( this, arguments );
	}

	View.extend = extend;

	utils.extend( View, Bob.helpers );

	utils.extend( View.prototype, Emitter, Bob.mixin, {
		template: null,

		destroy: function() {
			if ( this.isDestroyed ) {
				return this;
			}

			this.trigger( 'before:destroy', this );

			this.isDestroyed = true;
			this.el.remove();
			this.stopListening();

			this.trigger( 'destroy', this );

			return this;
		},

		initialize: function() {},

		render: function() {
			this.trigger( 'before:render', this );

			this.el = this.build( this.template );
			this.$el = new Element( this.el );

			this.trigger( 'render', this );

			this.isDestroyed = false;

			return this;
		}
	} );

	return View;
} );
