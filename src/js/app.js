var Box = require('t3js');

Box.Application.addModule('modal', require('./modules/modal'));
Box.Application.addModule('open-modal', require('./modules/open-modal'));

Box.Application.init();
