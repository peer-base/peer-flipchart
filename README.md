# peer-flipchart

<a href="https://protocol.ai"><img src="https://img.shields.io/badge/made%20by-Protocol%20Labs-blue.svg?style=flat-square" /></a>
<a href="http://webchat.freenode.net/?channels=%23ipfs"><img src="https://img.shields.io/badge/freenode-%23ipfs-blue.svg?style=flat-square" /></a>

DIY Decentralized Flipchart app

## Pre-requisites

* Node.js v8.x.x or higher installed
* Git installed
* Access to a command-line window
* Modern browser (that supports WebRTC)

## Setup

### Download

```bash
$ git clone https://github.com/ipfs-shipyard/peer-flipchart.git
$ cd p2p-flipchart
```

### Install

```bash
$ npm install
````

### Start

You will need two command-line windows.

On one, watch your source files for changes and build:

```bash
$ npm run build:watch
```

On the other, start a static HTTP server:

```bash
$ npm start
```

### Access

Head out to [http://localhost:5000](http://localhost:5000) and verify that the flipchart app is functional.


## Code!

Open file [`src/index.js`](src/index.js) in a code editor.

### Step 1: create an IPFS node

Uncomment all the lines that are related to starting an IPFS node.

Result should be similar to file [`src/1-ipfs.js`](src/1-ipfs.js).

### Step 2: Create CRDT and bind it with IPFS

Uncomment all the lines that are related to CRDT.

Result should be similar to file [`src/2-crdt.js`](src/2-crdt.js).

Now it should all be working, and all connected nodes should be able to see each other's changes.


## Under the hood

```
                   ┌───────────────────────────────────────────────────────────────────────┐
                   │             ┌───────────────────┐   ┌───────────────────┐             │
                   │             │                   │   │                   │             │
                   │             │                   │   │                   │             │
                   │             │ y-ipfs-connector  │   │   Flipchart App   │             │
                   │             │                   │   │                   │             │
   .───────.       │ ┌───────────┤   ▲          ▲    ├───┤     ▲       ▲     ├───────────┐ │
 ,'         `.     │ │           └───┼─────┬────┼────┘   └─────┼───┬───┼─────┘           │ │
;IPFS network :    │ │               ▼     │    ▼              ▼   │   ▼                 │ │
:             ;◀───┼▶│      IPFS node      │         Y.js          │  D3 (for drawing)   │ │
 ╲           ╱     │ │                     │                       │                     │ │
  `.       ,'      │ │                     │           ▲           │               │     │ │
    `─────'        │ └─────────────────────┴───────────┼───────────┼───────────────┼─────┤ │
                   │                         ┌─────────▼─────────┐ │               ▼     │ │
                   │                         │                   │ │                     │ │
                   │                         │     IndexedDB     │ │                     │ │
                   │                         │                   │ │     SVG Canvas      │ │
                   │                         │                   │ │                     │ │
                   │                         └───────────────────┘ │                     │ │
                   │                                               │                     │ │
                   │                                               └─────────────────────┘ │
                   └───────────────────────────────────────────────────────────────────────┘
```

* D3 is used to abstract drawing on an SVG canvas
* Y.js provides the CRDT
* IPFS provides the networking between nodes
* y-ipfs-connector is used to connect Y.js to the IPFS node
* IndexedDB is used to persist CRDT data

```
   ┌──────────┐                  ┌──────────┐
   │          │                  │          │
   │Flipchart │                  │Flipchart │
   │   App    │◀────────────────▶│   App    │
   │          │                  │          │
   └──────────┘                  └──────────┘
         ▲                             ▲
         │                             │
         │                             │
         │                             │
         │        ┌──────────┐         │      ┌──────────┐
         │        │          │         │      │          │
         │        │Flipchart │         │      │Other IPFS│
         └───────▶│   App    │◀────────┘      │   node   │
                  │          │                │          │
┌──────────┐      └──────────┘                └──────────┘
│          │
│Other IPFS│
│   node   │
│          │
└──────────┘
```

After discovering each-other, nodes connect directly.


# License

MIT
