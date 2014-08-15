var lib_opt = require('../strftime-opt.js'),
    lib     = require('../strftime.js');

var Benchmark = require('benchmark');
var suite = new Benchmark.Suite
var date = new Date(1307472705067);
var bench = suite
  .add("original",function(){    
    lib.strftime("%Y-%-m-%0dT%H:%_M:%S%z",date);
  })
  .add("optimization",function(){    
    lib_opt.strftime("%Y-%-m-%0dT%H:%_M:%S%z",date);
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    var slowest = this.filter("slowest");
    var fastest = this.filter("fastest");  
    console.log('Fastest is ' + this.filter('fastest').pluck('name') + " in " + fastest[0].hz / slowest[0].hz);
  })
  .run({ 'async': true });