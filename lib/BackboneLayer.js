/* jslint node: true */
"use strict";

var _ = require('lodash');

var BackboneLayer = (function (L) {
  L = L || require('leaflet');

  return L.Class.extend({
    options: {
      interactive: true,
      nonBubblingEvents: ['click', 'dblclick', 'mouseover', 'mouseout', 'contextmenu']
    },
    initialize: function(collection, marker_factory, layer_class) {
      this.collection = collection;
      this.collection.on('add', this.appendMarker, this);

      this.layer_classes = ['leaflet-zoom-hide', layer_class || ''];
      this.marker_factory = marker_factory;
      this.markers = [];
    },
    onAdd: function(map) {
      this._map = map;
      this._el = L.DomUtil.create('div', this.layer_classes.join(' '));
      map.getPanes().overlayPane.appendChild(this._el);
      map.on('viewreset', this._reset, this);
      this._reset();
    },
    onRemove: function(map) {
      map.getPanes().overlayPane.removeChild(this._el);
      map.off('viewreset', this._reset, this);
    },
    _reset: function() {
      _.each(this.markers, function(marker) {
        marker.reset();
      });
    },
    appendMarker: function(item) {
      if (this._doesNotHaveCoordinates(item)) {
        throw new Error('model should have a coordinates() function which returns [lat, lon]');
      }
      var marker = this.marker_factory({
        model: item,
        layer: this
      });
      this.markers.push(marker);
      marker.render();
    },
    _doesNotHaveCoordinates: function _doesNotHaveCoordinates(item) {
      return !(item.coordinates &&
        item.coordinates instanceof Function &&
        item.coordinates() instanceof Array &&
        item.coordinates().length >= 2 &&
        item.coordinates().length <= 3);
    }
  });
})(this.L); // compatibility with mapbox.js

module.exports = BackboneLayer;