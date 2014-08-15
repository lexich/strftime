var fs = require("fs");
var lib_opt = require('../strftime-opt.js');
var Time = new Date(1307472705067);
var res1 = lib_opt.strftime('%Y-%-m-%0dT%H:%_M:%S%z', Time);
var res2 = lib_opt.strftime('%Y-%-m-%0dT%H:%_M:%S%z', Time);
//var res1 = lib_opt.strftime('%A', Time);
//var res2 = lib_opt.strftime('%A', Time);

//console.log(res1);
//console.log(res2);
//Time = new Date("Sun Apr 07 2013 20:12:16 GMT-0700 (PDT)")
//var str = lib_opt.strftime("%j",Time);
//console.log(str);
//var res = lib_opt.mutation_body();
//console.log(res);
//fs.writeFileSync("_debug.js",res);
