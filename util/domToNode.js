const parse5 = require('parse5');

function domToNode(domNode) {
  const nodeElement = {};
  if (domNode.nodeName == '#document') {
    domNode = domNode.childNodes[0];
  }

  if (domNode.nodeName == '#text')
    return domNode.value;
  if (!domNode.tagName)
    return false;

  nodeElement.tag = domNode.tagName.toLowerCase();
  if(domNode.attrs) {
    for (let i = 0; i < domNode.attrs.length; i++) {
      const attr = domNode.attrs[i];
      if (attr.name == 'href' || attr.name == 'src') {
        if (!nodeElement.attrs) {
          nodeElement.attrs = {};
        }
        nodeElement.attrs[attr.name] = attr.value;
      }
    }
  }
  
  if (domNode.childNodes.length > 0) {
    nodeElement.children = [];
    for (let i = 0; i < domNode.childNodes.length; i++) {
      const child = domNode.childNodes[i];
      nodeElement.children.push(domToNode(child));
    }
  }
  return nodeElement;
}

function HTMLToTelegraph(html) {
  const dom = parse5.parse(html);
  const nodes = domToNode(dom);
  return nodes;
};

module.exports = HTMLToTelegraph;
