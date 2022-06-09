// initialize global variables.
var edges;
var nodes;
var network;
var container;
var options, data;

// This method is responsible for drawing the graph, returns the drawn network
function drawGraph(node_list, edge_list) {
  var container = document.getElementById('mynetwork');

  // parsing and collecting nodes and edges from the python
  nodes = new vis.DataSet(node_list);
  edges = new vis.DataSet(edge_list);

  // adding nodes and edges to the graph
  data = { nodes: nodes, edges: edges };

  var options = {
    configure: {
      enabled: false,
    },
    edges: {
      color: {
        inherit: true,
      },
      smooth: {
        enabled: true,
        type: 'dynamic',
      },
    },
    interaction: {
      dragNodes: true,
      hideEdgesOnDrag: false,
      hideNodesOnDrag: false,
    },
    physics: {
      enabled: true,
      stabilization: {
        enabled: true,
        fit: true,
        iterations: 1000,
        onlyDynamicEdges: false,
        updateInterval: 50,
      },
    },
  };

  network = new vis.Network(container, data, options);

  return network;
}

// Graph Implementation
class Graph {
  constructor(adj_list = {}) {
    this.adjacencyList = adj_list;
  }
  addNode(node) {
    if (!this.adjacencyList[node] && node != '') {
      this.adjacencyList[node] = {};
    }
  }
  addEdge(node1, node2, weight) {
    // console.log(node1, node2, weight);
    // console.log(this.adjacencyList);
    this.adjacencyList[node1][node2] = weight;
  }

  removeEdge(node1, node2) {
    delete this.adjacencyList[node1][node2];
    // delete this.adjacencyList[node2][node1];
  }

  removeNode(node) {
    delete this.adjacencyList[node];
    for (let key in this.adjacencyList) {
      delete this.adjacencyList[key][node];
    }
  }

  display() {
    for (let node in this.adjacencyList) {
      console.log(node);
      for (let neighbor in this.adjacencyList[node]) {
        console.log(neighbor + ' ' + this.adjacencyList[node][neighbor]);
      }
    }
  }
}

// Bellman Ford Algorithm
function BellmanFord(gph, src, dest) {
  let nodes = [];
  let edges = [];
  for (let vertex in gph.adjacencyList) {
    nodes.push(vertex);
    for (let neighbor in gph.adjacencyList[vertex]) {
      edges.push([vertex, neighbor, gph.adjacencyList[vertex][neighbor]]);
    }
  }
  console.log(nodes);
  console.log(edges);
  inf = Number.POSITIVE_INFINITY;
  let E = edges.length;
  let V = nodes.length;
  let dis = {};
  for (let node in gph.adjacencyList) {
    dis = { ...dis, [node]: { cost: inf, pred: [] } };
  }
  dis[src].cost = 0;
  for (let i = 0; i < V - 1; i++) {
    for (let j = 0; j < E; j++) {
      let u = edges[j][0];
      let v = edges[j][1];
      let w = edges[j][2];
      if (dis[u].cost + w < dis[v].cost) {
        dis[v].cost = dis[u].cost + w;
        dis[v].pred = [...dis[u].pred, u];
      }
    }
  }

  for (let k = 0; k < E; k++) {
    let u = edges[k][0];
    let v = edges[k][1];
    let w = edges[k][2];
    if (dis[u].cost + w < dis[v].cost) {
      return { path: [], cost: -1 };
    }
  }

  let cost_of_path = dis[dest].cost;
  let optimal_path = [...dis[dest].pred, dest];
  return { path: optimal_path, cost: cost_of_path };
}

const printTable = (table) => {
  return Object.keys(table)
    .map((vertex) => {
      var { vertex: from, cost } = table[vertex];
      return `${vertex}: ${cost} via ${from}`;
    })
    .join('\n');
};

const tracePath = (table, start, end) => {
  var path = [];
  var next = end;
  while (true) {
    path.unshift(next);
    if (next === start) {
      break;
    }
    // console.log(table[next]);
    if (table[next]) {
      next = table[next].vertex;
    } else {
      break;
    }
  }

  return path;
};

const formatGraph = (g) => {
  const tmp = {};
  Object.keys(g).forEach((k) => {
    const obj = g[k];
    const arr = [];
    Object.keys(obj).forEach((v) => arr.push({ vertex: v, cost: obj[v] }));
    tmp[k] = arr;
  });
  return tmp;
};

function dijkstra(graph, start, end) {
  var map = formatGraph(graph);

  var visited = [];
  var unvisited = [start];
  var shortestDistances = { [start]: { vertex: start, cost: 0 } };

  var vertex;
  while ((vertex = unvisited.shift())) {
    // Explore unvisited neighbors
    var neighbors = map[vertex].filter((n) => !visited.includes(n.vertex));

    // Add neighbors to the unvisited list
    unvisited.push(...neighbors.map((n) => n.vertex));

    var costToVertex = shortestDistances[vertex].cost;

    for (let { vertex: to, cost } of neighbors) {
      var currCostToNeighbor =
        shortestDistances[to] && shortestDistances[to].cost;
      var newCostToNeighbor = costToVertex + cost;
      if (
        currCostToNeighbor == undefined ||
        newCostToNeighbor < currCostToNeighbor
      ) {
        // Update the table
        shortestDistances[to] = { vertex, cost: newCostToNeighbor };
      }
    }

    visited.push(vertex);
  }

  console.log('Table of costs:');
  console.log(printTable(shortestDistances));
  // console.log(shortestDistances);
  const path = tracePath(shortestDistances, start, end);
  if (shortestDistances[end]) {
    return { path, cost: shortestDistances[end].cost };
  } else {
    return { path, cost: Infinity };
  }
  // return { path, cost: shortestDistances[end].cost };
  // console.log(
  //   'Shortest path is: ',
  //   path.join(','),
  //   ' with weight ',
  //   shortestDistances[end].cost
  // );
}

let graph = new Graph();

// graph.addNode('h-A');
// graph.addNode('B');
// graph.addNode('C');
// graph.addNode('p-D');
// graph.addEdge('B', 'p-D', 7);
// graph.addEdge('C', 'p-D', 4);
// graph.addEdge('h-A', 'B', 5);
// graph.addEdge('h-A', 'C', 6);

// graph.addNode('h-A');
// graph.addNode('B');
// graph.addNode('C');
// graph.addNode('p-D');
// graph.addEdge('h-A', 'B', 5);
// graph.addEdge('h-A', 'C', 10);
// graph.addEdge('B', 'p-D', 15);
// graph.addEdge('C', 'p-D', 20);
// console.log(graph.adjacencyList);

// let result = BellmanFord(graph, 'h-A', 'p-D');
// console.log(result);

function createGraphList(adjacencyList, minPath = []) {
  let node_list = [];
  for (let node in adjacencyList) {
    if (node.startsWith('h-')) {
      node_list.push({
        color: 'green',
        id: node,
        label: node,
        shape: 'dot',
        size: 20,
        title: `House ${node}`,
      });
    } else if (node.startsWith('p-')) {
      node_list.push({
        color: 'brown',
        id: node,
        label: node,
        shape: 'dot',
        size: 20,
        title: `Plant ${node}`,
      });
    } else {
      node_list.push({
        id: node,
        label: node,
        shape: 'dot',
        size: 13,
        title: `Junction ${node}`,
      });
    }
  }

  let edge_list = [];
  for (let node in adjacencyList) {
    for (let neighbor in adjacencyList[node]) {
      if (minPath.includes(node) && minPath.includes(neighbor)) {
        edge_list.push({
          arrows: 'to',
          color: 'red',
          from: node,
          label: adjacencyList[node][neighbor].toString(),
          to: neighbor,
        });
      } else {
        edge_list.push({
          arrows: 'to',
          color: '#000000',
          from: node,
          label: adjacencyList[node][neighbor].toString(),
          to: neighbor,
        });
      }
    }
  }

  return { node_list, edge_list };
}

function refreshGraph() {
  let obj = createGraphList(graph.adjacencyList);
  drawGraph(obj.node_list, obj.edge_list);
}

refreshGraph();

function readFromLocalStorage() {
  let graph_data = localStorage.getItem('graph'); // parse JSON
  if (graph_data) {
    console.log(graph_data);
    graph.adjacencyList = JSON.parse(graph_data);
    refreshGraph();
  }
}

function refreshLocalStorage() {
  localStorage.setItem('graph', JSON.stringify(graph.adjacencyList));
}

function refreshInputs() {
  for (let node in graph.adjacencyList) {
    let find_1 = $('.add-edge-sel').find(`option[value="${node}"]`);
    let find_2 = $('#shortest-path-from-sel').find(`option[value="${node}"]`);
    if (find_1.length === 0) {
      $('.add-edge-sel').append(`<option value="${node}">${node}</option>`);
    }

    if (find_2.length === 0 && node.startsWith('h-')) {
      $('#shortest-path-from-sel').append(
        `<option value="${node}">${node}</option>`
      );
    }
    $('#add-node').val('');
  }
}

if (typeof String.prototype.trim === 'undefined') {
  String.prototype.trim = function () {
    return String(this).replace(/^\s+|\s+$/g, '');
  };
}

function resetInputsFields() {
  $('#add-node').val('');
  $('#add-edge-from').val('');
  $('#add-edge-to').val('');
  $('.add-edge-sel').html('');
  $('#shortest-path-from-sel').html('');
  $('.add-edge-sel').append(`<option value="">---Select Node---</option>`);
  $('#shortest-path-from-sel').append(
    `<option value="">---Select Starting Node---</option>`
  );
}

// file handling
function init() {
  document
    .getElementById('fileInput')
    .addEventListener('change', handleFileSelect, false);
}

function handleFileSelect(event) {
  const reader = new FileReader();
  reader.onload = handleFileLoad;
  reader.readAsText(event.target.files[0]);
}

function handleFileLoad(event) {
  console.log(event);
  graph.adjacencyList = {};
  let graph_data = event.target.result;
  for (let line of graph_data.split('\n')) {
    line = line.trim();
    if (line.split(' ').length === 3) {
      let [node1, node2, weight] = line.split(' ');
      console.log(node1, node2, weight);

      graph.addEdge(String(node1), String(node2), Number(weight));
    } else {
      graph.addNode(line);
    }
  }
  refreshLocalStorage();
  readFromLocalStorage();
  refreshInputs();
}

function saveGraphToFile() {
  let graph_txt = '';
  for (let node in graph.adjacencyList) {
    graph_txt += node + '\n';
  }
  for (let node in graph.adjacencyList) {
    for (let neighbor in graph.adjacencyList[node]) {
      graph_txt +=
        node +
        ' ' +
        neighbor +
        ' ' +
        graph.adjacencyList[node][neighbor] +
        '\n';
    }
  }

  var blob = new Blob([graph_txt], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `graph_${Number(new Date())}.txt`);
}

// jQuery events
$(document).ready(function () {
  $('.add-edge-sel').append(`<option value="">---Select Node---</option>`);
  $('#shortest-path-from-sel').append(
    `<option value="">---Select Starting Node---</option>`
  );

  // Refresh graph from local storage
  readFromLocalStorage();
  refreshInputs();

  $('#save-btn').click(function () {
    saveGraphToFile();
  });

  $('#clear-btn').click(function () {
    localStorage.clear();
    graph.adjacencyList = {};
    refreshLocalStorage();
    refreshGraph();
    resetInputsFields();
    $('#fileInput').val('');
  });

  $('.show-ge').hide();
  $('#close-ge').click(function () {
    $('.con-2').hide();
    $('.show-ge').show();
  });
  $('.show-ge').click(function () {
    $('.con-2').show();
    $('.show-ge').hide();
  });
  $('.con-1').hide();
  $('.hide-me').click(function () {
    $('.con-1').hide();
    $('.show-me').show();
  });

  $('.show-me').click(function () {
    $('.con-1').show();
    $('.show-me').hide();
  });

  $('#add-node-btn').click(function () {
    if ($('#add-node').val() != '') {
      let node = $('#add-node').val();
      graph.addNode(node);
      refreshGraph();
      refreshLocalStorage();
      $('.add-edge-sel').append(`<option value="${node}">${node}</option>`);
      $('#add-node').val('');
      if (node.startsWith('h-')) {
        $('#shortest-path-from-sel').append(
          `<option value="${node}">${node}</option>`
        );
      }
      // readFromLocalStorage();
      // refreshInputs();
    }
  });

  $('#add-edge-btn').click(function () {
    if ($('#add-edge-from').val() != '' && $('#add-edge-to').val() != '') {
      let from = $('#add-edge-from').val();
      let to = $('#add-edge-to').val();
      let weight = $('#add-edge-weight').val();
      $('#add-edge-from').val('');
      $('#add-edge-to').val('');
      $('#add-edge-weight').val('');
      graph.addEdge(from, to, Number(weight));
      refreshGraph();
      refreshLocalStorage();
    }
  });

  $('#rm-node-btn').click(function () {
    if ($('#rm-node').val() != '') {
      let node = $('#rm-node').val();
      graph.removeNode(node);
      refreshGraph();
      refreshLocalStorage();
      $('.add-edge-sel').find(`option[value="${node}"]`).remove();
      $('#shortest-path-from-sel').find(`option[value="${node}"]`).remove();
      $('#rm-node').val('');
    }
  });

  $('#rm-edge-btn').click(function () {
    if ($('#rm-edge-from').val() != '' && $('#rm-edge-to').val() != '') {
      let from = $('#rm-edge-from').val();
      let to = $('#rm-edge-to').val();
      $('#rm-edge-from').val('');
      $('#rm-edge-to').val('');
      graph.removeEdge(from, to);
      refreshGraph();
      refreshLocalStorage();
    }
  });

  $('#shortest-path-btn').click(function () {
    let minCost = Infinity;
    minPath = [];
    for (let node in graph.adjacencyList) {
      if (node.startsWith('p-')) {
        if ($('#shortest-path-from-sel').val() != '') {
          let from = $('#shortest-path-from-sel').val();
          let result;
          let startTime = performance.now();
          if ($('#algo-sel').val() === 'dijkstra') {
            result = dijkstra(graph.adjacencyList, from, node);
          } else if ($('#algo-sel').val() === 'bellman-ford') {
            result = BellmanFord(graph, from, node);
          }
          let endTime = performance.now();
          // let result = BellmanFord(graph, from, node);
          let run_time = endTime - startTime;
          run_time = Math.round((run_time + Number.EPSILON) * 100) / 100;
          console.log(`Algorithm took ${run_time} milliseconds`);
          $('#run-time').text(String(run_time) + ' milliseconds');
          let path = result.path;
          let cost = result.cost;
          console.log(path, cost);
          if (cost < minCost) {
            minCost = cost;
            minPath = path;
          }
        }
      }
    }
    let from_house = $('#shortest-path-from-sel').val();

    $('#path').text(minPath.join(', '));
    $('#selected-house').text(from_house);
    $('#dest-plant').text(minPath[minPath.length - 1]);
    $('#path-length').text(minCost);
    $('.show-me').hide();
    $('.con-1').show();

    let obj = createGraphList(graph.adjacencyList, minPath);
    drawGraph(obj.node_list, obj.edge_list);
    // refreshLocalStorage();
  });
});
