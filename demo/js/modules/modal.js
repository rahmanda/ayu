var Box  = require('t3js');
var Oboe = require('oboe');

var Modal = function (context) {

  'use strict';

  var el, template, delay;

  return {

    init: function() {

      el = context.getElement();

      template = '';

    },

    destroy: function() {

      el = null;

      template = null;

    },

    messages: ['open-modal',
               'open-modal-ajax',
               'close-modal'],

    // @param {string} name
    // @param {html string} data
    onmessage: function(name, data) {

      if(name === 'open-modal-ajax') {

        this.open(data, true);

      } else if(name === 'open-modal') {

        this.open(data);

      } else if(name === 'close-modal') {

        this.close();

      }

    },

    onclick: function(ev, el, evType) {

      if(evType === 'close-modal') {

        ev.preventDefault();

        context.broadcast('close-modal');

      }

    },

    setSize: function() {
      // viewport
      var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

      el.style.width = width + 'px';
      el.style.height = height + 'px';
    },

    // Open Modal
    // @param {html string} Modal content
    // @param {boolean} ajax
    // @return void
    open: function(modalContent, ajax) {

      ajax = typeof ajax === 'undefined' ? false : ajax;

      document.getElementsByTagName('body')[0].classList.add('no-scroll');
      el.classList.remove('is-hidden');

      if(ajax) {
        this.renderAjax(modalContent);
      } else {
        this.render(modalContent);
      }

    },

    // Close Modal
    // @param void
    // @return void
    close: function() {

      document.getElementsByTagName('body')[0].classList.remove('no-scroll');
      el.classList.add('is-hidden');

    },

    // Render Modal
    // @param {html string} content
    // @return void
    render: function(content) {

      el.innerHTML = content;

    },

    // Render Modal via Ajax
    // @param {string} path
    // @return void
    renderAjax: function(path) {

      var that = this;

      Oboe(path)

        .done(that.injectHTML)

        .fail(function() {
          console.log('modal-ajax-failed');
        });

    },

    // Inject HTML response from ajax
    // @param {object} response
    // @return void
    injectHTML: function(response) {

      el.innerHTML = response.html;

      Box.Application.startAll(el);

    }

  };

};

module.exports = Modal;
