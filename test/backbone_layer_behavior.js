/* jslint node: true */
/* jslint expr: true */
/*global describe, it, before, beforeEach, after, afterEach */
"use strict";

var chai = require('chai');
var should = chai.should();
var sinon = require('sinon');
var sinon_chai = require('sinon-chai');
chai.use(sinon_chai);

var Backbone = require('backbone');
var BackboneLayer = require('../lib/BackboneLayer');

describe('BackboneLayer behavior', function () {
  var layer, collection, marker;

  beforeEach(function () {
    marker = {
      render: sinon.spy()
    };
  });

  function initializeBackboneLayer(model) {
    var DummyModel = Backbone.Model.extend(model || {
        coordinates: function () {
          return [43.6, 3.9];
        }
      });

    var DummyCollection = Backbone.Collection.extend({
      model: DummyModel
    });

    collection = new DummyCollection();
    var factory = function () {
      return marker;
    };

    layer = new BackboneLayer(collection, factory);
  }

  it('should append and render a marker when added to backbone collection', function () {
    initializeBackboneLayer();

    collection.add([{}]);
    marker.render.should.have.been.calledOnce;
  });

  it('should raise an error when model has no coordinates method', function () {
    initializeBackboneLayer({});
    (function () {
      collection.add([{}])
    }).should.Throw(Error);

    marker.render.should.not.have.been.called;
  });

  it('should raise an error when model.coordinates is not a function', function () {
    initializeBackboneLayer({
      initialize: function () {
        this.coordinates = [43.6, 3.9];
      }
    });

    (function () {
      collection.add([{}])
    }).should.Throw(Error, 'coordinates() function');

    marker.render.should.not.have.been.called;
  });

  it('should raise an error when model.coordinates() does not return an array', function () {
    initializeBackboneLayer({
      coordinates: function () {
        return {};
      }
    });

    (function () {
      collection.add([{}])
    }).should.Throw(Error, 'coordinates() function');

    marker.render.should.not.have.been.called;
  });

  it('should raise an error when model.coordinates() does not return an array of 2 or 3 values', function () {
    initializeBackboneLayer({
      coordinates: function () {
        return [];
      }
    });

    (function () {
      collection.add([{}])
    }).should.Throw(Error, 'coordinates() function');

    marker.render.should.not.have.been.called;
  });
});