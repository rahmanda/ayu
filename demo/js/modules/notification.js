var Notification = function (context) {

  'use strict';

  var el, delay;

  var TIMEOUT = 2500;

  return {

    onclick: function(ev, el, elType) {

      if(elType === 'trigger') {

        this.show(el);
      }

    },

    show: function(el) {
      var target = el.dataset.target;
      document.getElementById(target)
        .classList.add('is-show');
      delay = setTimeout(function() {
        document.getElementById(target).classList.remove('is-show');
      }, TIMEOUT);
    }
  };
};

module.exports = Notification;
