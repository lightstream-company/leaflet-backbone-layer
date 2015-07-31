/* jslint node: true */
"use strict";

var Backbone = require('backbone');

var AbstractBackboneMarker = Backbone.View.extend({
  initialize: function initialize(options) {
    this.layer = options.layer;
    this.$el.appendTo(this.layer._el);
    this.render();
    this.listenTo(this.model, 'change', this.render);
  },
  toHTML: function () {
    return this.model.toJSON();
  },
  applyTemplate: function (item) {
    return '<div>' + JSON.stringify(item) + '</div>';
  },
  render: function render() {
    this.$el.html(this.applyTemplate(this.toHTML()));
    this.setPosition();
    this.animate();
  },
  reset: function reset() {
    this.setPosition();
  },
  setPosition: function () {
    var el = this.$el[0];
    this.position = this.layer._map.latLngToLayerPoint(this.model.coordinates());
    L.DomUtil.setPosition(el, this.position, true);
  },
  animate: function () {}
});

module.exports = AbstractBackboneMarker;

