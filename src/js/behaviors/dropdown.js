var Dropdown = function(context) {

  'use strict';

  function toggle(el, evType) {

    if (el) {

      var dropEl = el.getElementsByClassName(evType)[0];

      if(dropEl) {

        dropEl.classList.toggle('is-dropped');

      }

    }

  }

  return {

    onclick: function(ev, el, evType) {

      ev.preventDefault();

      toggle(el, evType);

    }

  };

};

module.exports = Dropdown;
