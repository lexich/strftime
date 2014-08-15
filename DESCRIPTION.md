Ефремов Алексей <lexich121@gmail.com>
## Описание
Для оптимизации используется несколько подходов:
- кэширование результатов выполнения предыдушего вызова
- кэширование скомпилированных в runtime шаблонов
- рефакторинг
    + минимальное кол-во вызовов методов и функций
    + исключение регулярного выражения из анализа шаблона
    + ускорение узких мест

Кэширование результатов организовано по входным данным и маске. При совпадении маски кэш-результатов обновляется.
При передачи локали кэширование отключается.

## Анализ результатов benchmark:
=================
Входные данные попадают в кэш результатов ускорение в 62 раза
#### Benchmark:
```javascript
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
```
#### Output:
```
TZ=America/Vancouver node test/perfomace.js
original x 148,228 ops/sec ±2.44% (94 runs sampled)
optimization x 9,234,755 ops/sec ±0.77% (91 runs sampled)
Fastest is optimization in 62.30091433479364
```
=================

=================
Входные данные не попадают в кэш результатов, используются
пердкомпилированные шаблоны. Ускорение в 13 раз
#### Benchmark:
```javascript
#!/usr/bin/env node
var lib_opt = require('../strftime-opt.js'),
    lib     = require('../strftime.js');

var Benchmark = require('benchmark');
var suite = new Benchmark.Suite

var date1 = new Date(1307472705067);
var date2 = new Date(1307472705068);
var checker = true;
var date;

var bench = suite
  .add("original",function(){
    date = (checker=!checker) ? date1 : date2;
    lib.strftime("%Y-%-m-%0dT%H:%_M:%S%z",date);
  })
  .add("optimization",function(){
    date = (checker=!checker) ? date1 : date2;
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
```
#### Output:
```
TZ=America/Vancouver node test/perfomace.js
original x 144,662 ops/sec ±1.31% (85 runs sampled)
optimization x 1,908,578 ops/sec ±1.86% (94 runs sampled)
Fastest is optimization in 13.193377538854609
```
=================


=================
Передаем локаль, кэш полностью отключен. Ускорение достигается 
исключительно за счет рефакторинга кода. Ускорение почти в 2.5 раза.
#### Benchmark:
```javascript
var date = new Date(1307472705067);
var Locale = { 
  AM: "AM", 
  PM: "PM", 
  am: "am", 
  pm: "pm", 
  formats:{}
};

var bench = suite
  .add("original",function(){    
    lib.strftime("%Y-%-m-%0dT%H:%_M:%S%z",date,Locale);
  })
  .add("optimization",function(){    
    lib_opt.strftime("%Y-%-m-%0dT%H:%_M:%S%z",date,Locale);
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
```
#### Output:
```
TZ=America/Vancouver node test/perfomace.js
original x 143,072 ops/sec ±2.19% (84 runs sampled)
optimization x 348,865 ops/sec ±1.25% (94 runs sampled)
Fastest is optimization in 2.438381693759734
```
=================