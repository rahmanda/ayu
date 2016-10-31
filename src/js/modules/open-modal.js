var OpenModal = function (context) {

  'use strict';

  var el;

  function getPathFromUrl(url) {

    var split = url.split('/');
    var trimmed = split.slice(3, split.length);

    return trimmed.join('/');

  }

  function getTemplate() {

    return document.getElementsByClassName('js-modal-template')[0].innerHTML;

  }

  return {

    onclick: function(ev, el, elType) {

      if(elType === 'open-modal-ajax') {

        this.show(el, true);

      } else if(elType === 'open-modal') {

        this.show(el);

      }

    },

    show: function(el, ajax) {

      ajax = typeof ajax === 'undefined' ? false : ajax;

      if(ajax) {

        var path = getPathFromUrl(el.getAttribute('href'));

        context.broadcast('open-modal-ajax', path);

      } else {

        context.broadcast(
          'open-modal',
          getTemplate()
        );

      }

    }

  };
};

module.exports = OpenModal;
