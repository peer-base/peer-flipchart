'use strict';

// ------ Y.js: import and wire dependencies --------
// const Y = require('yjs')
// require('y-array')(Y)
// require('y-memory')(Y)
// require('y-indexeddb')(Y)
// require('y-ipfs-connector')(Y)

const d3 = require('d3')

// ------ IPFS node creation ------
const ipfs = new Ipfs({
  EXPERIMENTAL: {
    pubsub: true
  },
  config: {
    Addresses: {
      Swarm: [
        '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
      ]
    }
  }
})

// ------ Wait for IPFS to start ------
ipfs.once('start', ipfsStarted)

async function ipfsStarted () {
  console.log('IPFS started')

  // ------ Y.js: Initialize CRDT ------
  // const y = await Y({
  //   db: {
  //     name: 'indexeddb'
  //   },
  //   connector: {
  //     name: 'ipfs',
  //     room: 'p2p-flipchart-demo-room',
  //     ipfs: ipfs
  //   },
  //   share: {
  //     flipchart: 'Array'
  //   }
  // })

  // var drawing = y.share.flipchart

  // ------ IPFS: print Peer Id ------
  ipfs.id(haveIPFSId)

  function haveIPFSId (err, peerId) {
    if (err) { throw err }
    document.getElementById('status').innerHTML = 'Started. Peer Id is ' +  peerId.id
  }

  // ------ D3: translate line point into D3 render path
  var renderPath = d3.line()
    .x(function (d) { return d[0] })
    .y(function (d) { return d[1] })
    .curve(d3.curveNatural)

  // ------ D3 Flipchart drawing initialization ------
  var svg = d3.select('#flipchart')

  // ------ CRDT and D3: Draw a new line ------
  // function drawLine (yarray) {
  //   var line = svg.append('path')
  //     .datum(yarray.toArray())
  //     .attr('class', 'line')

  //   line.attr('d', renderPath)

  //   // Observe changes that happen on this line
  //   yarray.observe(lineChanged)

  //   function lineChanged(event) {
  //     // we only implement insert events that are appended to the end of the array
  //     event.values.forEach(function (value) {
  //       line.datum().push(value)
  //     })
  //     line.attr('d', renderPath)
  //   }
  // }

  // ------ CRDT: listen for new and removed lines ------
  // drawing.observe(drawingChanged)

  // function drawingChanged (event) {
  //   if (event.type === 'insert') {
  //     event.values.forEach(drawLine)
  //   } else {
  //     // just remove all elements (thats what we do anyway)
  //     svg.selectAll('path').remove()
  //   }
  // }

  // ------ CRDT: draw all existing content ------
  // for (var i = 0; i < drawing.length; i++) {
  //   drawLine(drawing.get(i))
  // }

  // ------ User interaction: handle drag events ------
  svg.call(d3.drag()
    .on('start', dragStarted)
    .on('drag', dragged)
    .on('end', dragEnded))

  var sharedLine = null

  function dragStarted () {
    // --- With CRDT:
    // drawing.insert(drawing.length, [Y.Array])
    // sharedLine = drawing.get(drawing.length - 1)

    // --- Without CRDT:
    sharedLine = svg.append('path')
      .datum([])
      .attr('class', 'line')
  }

  // After one dragged event is recognized, we ignore them for 33ms.
  var ignoreDrag = null
  function dragged () {
    if (sharedLine && !ignoreDrag) {
      ignoreDrag = window.setTimeout(function () {
        ignoreDrag = null
      }, 33)
      const mouse = d3.mouse(this)

      // --- With CRDT:
      // sharedLine.push([mouse])

      // --- Without CRDT:
      sharedLine.datum().push(mouse)
      sharedLine.attr('d', renderPath)
    }
  }

  function dragEnded () {
    sharedLine = null
    window.clearTimeout(ignoreDrag)
    ignoreDrag = null
  }

  // ------ User interaction: Clear all ------

  document.getElementById('clear').onclick = clickedClear

  function clickedClear() {
    // --- With CRDT:
    // drawing.delete(0, drawing.length)

    // --- Without CRDT:
    svg.selectAll('path').remove()
  }
}
