/* jslint node: true */
"use strict";

// compatible with mapbox.js
var L = (window ? window.L : null) || require('leaflet');
var _ = require('lodash');

var BackboneLayer = L.Class.extend({
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
    this.markers_by_id = {};
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
    if (this._hasCoordinates(item)) {
      var marker = this.marker_factory({
        model: item,
        layer: this
      });
      this.markers.push(marker);
      this.markers_by_id[item.cid] = marker;
      marker.render();
    }
  },
  _hasCoordinates: function (item) {
    return item.longitude && item.latitude &&
      item.longitude() && item.latitude();
  }
});

module.exports = BackboneLayer;