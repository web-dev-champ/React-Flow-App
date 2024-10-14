import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './FlowCanvas.css'; // Import the CSS for tooltips

const iniedges = [
  { id: '0-1', source: '0', target: '1' },
  { id: '0-2', source: '0', target: '2' },
];
const initialNodes = [
  {
    id: '0',
    type: 'default',
    position: { x: 258.5, y: 160 },
    data: { label: 'After Graduation\nID: 0' }, // Displaying ID
  },
  {
    id: '1',
    data: { label: 'Jobs\nID: 1' },
    position: { x: 100.5, y: 415.5 },
    type: 'input',
  },
  {
    id: '2',
    data: { label: 'Higher Education\nID: 2' },
    position: { x: 416.5, y: 410.5 },
  },
  {
    id: '3',
    data: { label: 'Startups\nID: 3' },
    position: { x: 616.5, y: 160 },
  },
];

const FlowCanvas = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(iniedges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [newNodePosition, setNewNodePosition] = useState({ x: 0, y: 0 });
  const [sourceId, setSourceId] = useState(''); // State to store the source ID for a new edge
  const [targetId, setTargetId] = useState(''); // State to store the target ID for a new edge
  const [cursor, setCursor] = useState('default'); // State to store the cursor style

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nds) =>
        nds.map((node) => {
          const change = changes.find(({ id }) => id === node.id);
          return change ? { ...node, ...change } : node;
        })
      ),
    []
  );

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) =>
      eds.map((edge) => {
        const change = changes.find(({ id }) => id === edge.id);
        return change ? { ...edge, ...change } : edge;
      })
    );
  }, []);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const addCustomNode = () => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      data: { label: `${newNodeLabel || `Node ${nodes.length + 1}`}\nID: ${nodes.length + 1}` }, // Adding ID to the label
      position: { x: newNodePosition.x, y: newNodePosition.y },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const addCustomEdge = () => {
    if (sourceId && targetId) {
      const newEdge = {
        id: `${sourceId}-${targetId}`,
        source: sourceId,
        target: targetId,
      };
      setEdges((eds) => [...eds, newEdge]);
      setSourceId('');
      setTargetId('');
    } else {
      alert('Please enter both source and target node IDs.');
    }
  };

  // Function to change the cursor style
  const changeCursor = (cursorType) => {
    setCursor(cursorType);
  };

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex' }}>
      <div style={{ width: '75%', height: '100%', cursor: cursor }}>
        <h1>Reactflow Implementation</h1>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          style={{ width: '100%', height: '100%' }}
        >
          <MiniMap />
          <Controls />
          <Background variant={BackgroundVariant.Lines} color="#000" />
        </ReactFlow>
      </div>
      <div style={{ width: '25%', padding: '20px', background: '#f7f7f7' }}>
        {selectedNode ? (
          <div>
            <h3>Node Properties</h3>
            <p>ID: {selectedNode.id}</p>
            <p>
              Position: x = {selectedNode.position.x}, y = {selectedNode.position.y}
            </p>
            <p>Type: {selectedNode.type}</p>
          </div>
        ) : (
          <p>Select a node to see its properties</p>
        )}
        <div style={{ marginTop: '20px' }}>
          <h3>Create a New Node</h3>
          <input
            type="text"
            placeholder="Node Label"
            value={newNodeLabel}
            onChange={(e) => setNewNodeLabel(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <input
            type="number"
            placeholder="Position X"
            value={newNodePosition.x}
            onChange={(e) =>
              setNewNodePosition((pos) => ({ ...pos, x: parseFloat(e.target.value) }))
            }
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <input
            type="number"
            placeholder="Position Y"
            value={newNodePosition.y}
            onChange={(e) =>
              setNewNodePosition((pos) => ({ ...pos, y: parseFloat(e.target.value) }))
            }
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <button onClick={addCustomNode} style={{ width: '100%', padding: '10px' }}>
            Add Node
          </button>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h3>Create a New Edge</h3>
          <input
            type="text"
            placeholder="Source Node ID"
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <input
            type="text"
            placeholder="Target Node ID"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <button onClick={addCustomEdge} style={{ width: '100%', padding: '10px' }}>
            Add Edge
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlowCanvas;
