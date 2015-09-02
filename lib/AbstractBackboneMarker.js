/* jslint node: true */
"use strict";

var Backbone = require('backbone');

var AbstractBackboneMarker = Backbone.View.extend({
  initialize: function initialize(options) {
    this.layer = options.layer;
    this.$el.appendTo(this.layer._el);
    this.render();
    this.listenTo(this.model, 'change', this.rerender);
  },
  toHTML: function toHTML() {
    return this.model.toJSON();
  },
  applyTemplate: function applyTemplate(item) {
    return '<div>' + JSON.stringify(item) + '</div>';
  },
  render: function render() {
    this.$el.html(this.applyTemplate(this.toHTML()));
    this.rerender();
  },
  rerender: function rerender() {
    this.setPosition();
    this.animate();
  },
  reset: function reset() {
    this.setPosition();
  },
  getPosition: function () {
    return this.layer._map.latLngToLayerPoint(this.model.coordinates());
  },
  setPosition: function setPosition() {
    var el = this.$el[0];
    L.DomUtil.setPosition(el, this.getPosition(), true);
  },
  animate: function () {}
});

module.exports = AbstractBackboneMarker;

