'use strict';

const cropPubSub = function() {
    var events = {};
    // Subscribe
    this.on = function(names, handler) {
      names.split(' ').forEach(function(name) {
        if (!events[name]) {
          events[name] = [];
        }
        events[name].push(handler);
      });
      return this;
    };
    // Publish
    this.trigger = function(name, args) {
      if (events[name]) {
        events[name].forEach(function (handler) {
          handler.call(null, args);
        });
      }
      return this;
    };
}

export default cropPubSub;