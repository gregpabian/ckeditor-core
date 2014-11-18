CKEDITOR.define( [
	'mvc/application',
	'mvc/model',
	'mvc/space',
	'mvc/spacemanager',
	'mvc/view',
], function(
	Application,
	Model,
	Space,
	SpaceManager,
	View
) {
	'use strict';

	return {
		Application: Application,
		Model: Model,
		Space: Space,
		SpaceManager: SpaceManager,
		View: View
	};
} );
