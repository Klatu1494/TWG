class lBdGdLHeap {
  constructor(comparer) {
    this.heap = [null];
    this.comparer = comparer;
  }

  insert(x) {
    for (var position = this.heap.length; 1 < position && this.comparer(x, this.heap[Math.floor(position / 2)]) < 0; position = Math.floor(position / 2))
      this.heap[position] = this.heap[Math.floor(position / 2)];
    this.heap[position] = x;
  }

  removeFirst() {
    if (this.heap.length === 1) return null;
    var first = this.heap[1];
    var lastIndex = this.size();;
    var temp = this.heap[1] = this.heap[lastIndex];
    for (var i = 1; 2 * i <= lastIndex; i = child) {
      var child = 2 * i;
      if (child != lastIndex && 0 < this.comparer(this.heap[child], this.heap[child + 1])) child++;
      if (0 < this.comparer(temp, this.heap[child])) this.heap[i] = this.heap[child];
      else break;
    }
    this.heap[i] = temp;
    this.heap.pop();
    return first;
  }

  size() {
    return this.heap.length - 1;
  }
}

class lBdGdLNode {
  constructor() {
    this.costs = new Map();
  }

  costTo(node) {
    var cost = this.costs.get(node);
    return "number" === typeof cost ? cost : null;
  }

  linkWith(node, goCost, returnCost) {
    this.costs.set(node, goCost);
    node.costs.set(this, returnCost);
  }
}

class lBdGdLGraph {
  constructor(nodes) {
    this.nodes = [...nodes];
  }

  findBestPath(startNode, endNode) {
    var bestSizeSoFar = null;
    for (var node of this.nodes) node.bestPathsToThisNode = [];
    startNode.bestPathsToThisNode.push(new lBdGdLPath([startNode]));
    var paths = new lBdGdLHeap((a, b) => a.size / a.nodes.length - b.size / b.nodes.length)
    paths.insert(startNode.bestPathsToThisNode[0]);
    while (paths.size()) {
      var path = paths.removeFirst();
      for (var adyacentNode of path.nodes[path.nodes.length - 1].costs.keys()) {
        if (path.nodes.indexOf(adyacentNode) === -1) {
          var pathBeingAdded = path.duplicate().addNode(adyacentNode);
          if (!bestSizeSoFar || pathBeingAdded.size() <= bestSizeSoFar) {
            if (!adyacentNode.bestPathsToThisNode.length || pathBeingAdded.size() === adyacentNode.bestPathsToThisNode[0].size()) {
              adyacentNode.bestPathsToThisNode.push(pathBeingAdded);
            }
            if (pathBeingAdded.size() < adyacentNode.bestPathsToThisNode[0].size()) adyacentNode.bestPathsToThisNode = [pathBeingAdded];
            if (endNode === adyacentNode) bestSizeSoFar = Math.min(bestSizeSoFar, pathBeingAdded.size()) || pathBeingAdded.size();
            else paths.insert(pathBeingAdded);
          }
        }
      }
    }
    return endNode.bestPathsToThisNode[Math.floor(Math.random() * endNode.bestPathsToThisNode.length)] || null;
  }
}

class lBdGdLPath {
  constructor(initialNodes) {
    this.nodes = [...initialNodes];
  }

  addNode(node) {
    this.nodes.push(node);
    return this;
  }

  size() {
    var size = 0;
    for (var i = 0; i < this.nodes.length - 1; i++) size += this.nodes[i].costTo(this.nodes[i + 1]);
    return size;
  }

  duplicate() {
    return new lBdGdLPath([...this.nodes]);
  }

  addPath(path) {
    this.nodes = [...this.nodes, ...path.nodes];
    return this;
  }
}