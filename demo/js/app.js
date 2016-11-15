var Box = require('t3js');

Box.Application.addModule('modal', require('./modules/modal'));
Box.Application.addModule('open-modal', require('./modules/open-modal'));
Box.Application.addModule('actions', require('./modules/action'));

Box.Application.addBehavior('dropdown', require('./behaviors/dropdown'));

Box.Application.init();
