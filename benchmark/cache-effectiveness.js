/**
 * Cache Effectiveness Benchmark
 * Tests the performance improvements from caching strategies
 */

var benchmark = require('benchmark')
var benchmarks = require('beautify-benchmark')

// Create test namespace
var depd = require('../')
var deprecate = depd('test-cache')

// Create test functions and properties
function testFn1 () { return 1 }
function testFn2 () { return 2 }
function testFn3 () { return 3 }

var obj = {
  prop1: 'value1',
  prop2: 'value2',
  prop3: 'value3'
}

// Wrap functions
var wrappedFn1 = deprecate.function(testFn1, 'testFn1 is deprecated')
var wrappedFn2 = deprecate.function(testFn2, 'testFn2 is deprecated')
var wrappedFn3 = deprecate.function(testFn3, 'testFn3 is deprecated')

// Wrap properties
deprecate.property(obj, 'prop1', 'prop1 is deprecated')
deprecate.property(obj, 'prop2', 'prop2 is deprecated')
deprecate.property(obj, 'prop3', 'prop3 is deprecated')

// Suppress output for benchmarking
process.env.NO_DEPRECATION = 'test-cache'

var suite = new benchmark.Suite()

suite.add({
  name: 'repeated function calls (cache hit)',
  minSamples: 100,
  fn: function () {
    wrappedFn1()
    wrappedFn1()
    wrappedFn1()
    wrappedFn1()
    wrappedFn1()
  }
})

suite.add({
  name: 'varied function calls (cache mix)',
  minSamples: 100,
  fn: function () {
    wrappedFn1()
    wrappedFn2()
    wrappedFn3()
    wrappedFn1()
    wrappedFn2()
  }
})

suite.add({
  name: 'repeated property access (cache hit)',
  minSamples: 100,
  fn: function () {
    var x = obj.prop1
    x = obj.prop1
    x = obj.prop1
    x = obj.prop1
    x = obj.prop1
  }
})

suite.add({
  name: 'varied property access (cache mix)',
  minSamples: 100,
  fn: function () {
    var x = obj.prop1
    x = obj.prop2
    x = obj.prop3
    x = obj.prop1
    x = obj.prop2
  }
})

suite.add({
  name: 'direct deprecate calls (message cache)',
  minSamples: 100,
  fn: function () {
    deprecate('test message 1')
    deprecate('test message 2')
    deprecate('test message 1')
    deprecate('test message 2')
    deprecate('test message 1')
  }
})

suite.on('cycle', function onCycle (event) {
  benchmarks.add(event.target)
})

suite.on('complete', function onComplete () {
  benchmarks.log()
  console.log('\n=== Cache Effectiveness Summary ===')
  console.log('Optimizations implemented:')
  console.log('  - Stack trace caching')
  console.log('  - Caller site memoization')
  console.log('  - Message formatting cache')
  console.log('  - Namespace handling optimization')
  console.log('  - Property lookup optimization')
})

suite.run({ async: false })
