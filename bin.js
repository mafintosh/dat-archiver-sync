#!/usr/bin/env node

var hypercore = require('hypercore')
var hyperdrive = require('hyperdrive')
var ram = require('random-access-memory')
var swarm = require('hyperdiscovery')
var each = require('stream-each')
var storage = require('dat-storage')
var minimist = require('minimist')
var path = require('path')

var argv = minimist(process.argv.slice(2))
var validate = /^(dat:\/\/)?([a-fA-F0-9]{64})(\/)?$/
var key = argv._[0] && (argv._[0].match(validate) || [])[2]
var folder = argv.out || argv.o || '.'

if (!key) {
  console.error('Usage: dat-archiver-sync [archiver-key]')
  process.exit(1)
}

var changes = hypercore(ram, key, {valueEncoding: 'json'})

each(changes.createReadStream({live: true}), update)

changes.on('ready', function () {
  swarm(changes)
})

function update (data, cb) {
  if (data.type !== 'add' || typeof data.key !== 'string') return cb()

  var id = new Buffer(data.key, 'hex')
  if (argv.bytes) id = id.slice(0, argv.bytes)
  var dir = path.join(folder, id.toString('hex'))

  var drive = hyperdrive(storage(dir), data.key, {
    latest: true
  })

  drive.on('ready', function () {
    console.log('Syncing ' + drive.key.toString('hex') + ' to ' + dir)
    swarm(drive)
  })

  cb(null)
}
