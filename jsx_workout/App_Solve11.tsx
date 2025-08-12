import React, { useState, useRef } from 'react';

type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  radius: number;
  color: string;
};

type Edge = {
  id: string;
  from: string;
  to: string;
};

const nodeColors = [
  '#e63946',
  '#f1faee',
  '#457b9d',
  '#2a9d8f',
  '#ffb703',
  '#fb8500',
  '#8ecae6',
];

const defaultRadius = 40;

const Flowchart: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [connectSourceNode, setConnectSourceNode] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const [selectedColor, setSelectedColor] = useState(nodeColors[0]);

  const draggingNodeId = useRef<string | null>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const getCenter = (node: Node) => ({ x: node.x, y: node.y });

  const handleMouseDown = (event: React.MouseEvent, nodeId: string) => {
    event.stopPropagation();

    if (connectSourceNode && connectSourceNode !== nodeId) {
      const exists = edges.some(
        (e) => e.from === connectSourceNode && e.to === nodeId
      );
      if (!exists) {
        const newEdge: Edge = {
          id: `e${edges.length + 1}`,
          from: connectSourceNode,
          to: nodeId,
        };
        setEdges([...edges, newEdge]);
      }
      setConnectSourceNode(null);
      setSelectedNodeId(nodeId);
      return;
    }

    draggingNodeId.current = nodeId;

    const svg = svgRef.current;
    if (!svg) return;

    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const cursorpt = pt.matrixTransform(svg.getScreenCTM()?.inverse());

    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    dragOffset.current = {
      x: cursorpt.x - node.x,
      y: cursorpt.y - node.y,
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!draggingNodeId.current) return;

    const svg = svgRef.current;
    if (!svg) return;

    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const cursorpt = pt.matrixTransform(svg.getScreenCTM()?.inverse());

    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === draggingNodeId.current
          ? {
              ...node,
              x: cursorpt.x - dragOffset.current.x,
              y: cursorpt.y - dragOffset.current.y,
            }
          : node
      )
    );
  };

  const handleMouseUp = () => {
    draggingNodeId.current = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  const handleEdgeClick = (edgeId: string) => {
    setEdges((prev) => prev.filter((e) => e.id !== edgeId));
  };

  const handleNodeClick = (nodeId: string) => {
    if (connectSourceNode === nodeId) {
      setConnectSourceNode(null);
      setSelectedNodeId(nodeId);
      return;
    }

    if (!connectSourceNode) {
      setSelectedNodeId(nodeId);
    }
  };

  const startConnectionMode = () => {
    if (selectedNodeId) {
      setConnectSourceNode(selectedNodeId);
    }
  };

  const removeConnection = (toNodeId: string) => {
    if (!selectedNodeId) return;
    setEdges((prev) =>
      prev.filter((e) => !(e.from === selectedNodeId && e.to === toNodeId))
    );
  };

  const addNode = () => {
    const newId = `node${nodes.length + 1}`;
    const newLabel = `Node ${nodes.length + 1}`;

    const x = 100 + (nodes.length % 5) * 80;
    const y = 50 + Math.floor(nodes.length / 5) * 120;

    const newNode: Node = {
      id: newId,
      label: newLabel,
      x,
      y,
      radius: defaultRadius,
      color: selectedColor,
    };

    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newId);
    setConnectSourceNode(null);
  };

  const deleteSelectedNode = () => {
    if (!selectedNodeId) return;
    setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId));
    setEdges((prev) =>
      prev.filter((e) => e.from !== selectedNodeId && e.to !== selectedNodeId)
    );
    setSelectedNodeId(null);
    setConnectSourceNode(null);
  };

  const renameSelectedNode = (newLabel: string) => {
    if (!selectedNodeId) return;
    setNodes((prev) =>
      prev.map((n) =>
        n.id === selectedNodeId ? { ...n, label: newLabel } : n
      )
    );
  };

  const outgoingConnections = edges
    .filter((e) => e.from === selectedNodeId)
    .map((e) => {
      const toNode = nodes.find((n) => n.id === e.to);
      return toNode ? { edgeId: e.id, toNode } : null;
    })
    .filter(Boolean) as { edgeId: string; toNode: Node }[];

  // Build adjacency matrix data
  const nodeIds = nodes.map((n) => n.id);
  // Create a 2D array with 0/1 indicating edge existence
  const adjacencyMatrix: number[][] = nodeIds.map((rowId) =>
    nodeIds.map((colId) => (edges.some((e) => e.from === rowId && e.to === colId) ? 1 : 0))
  );

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: 700, margin: 'auto' }}>
      <div
        style={{
          marginBottom: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        <label htmlFor="colorSelect">Select node color:</label>
        <select
          id="colorSelect"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        >
          {nodeColors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>

        <button onClick={addNode}>Add Node</button>

        {connectSourceNode ? (
          <span style={{ marginLeft: 10 }}>
            Connecting from:{' '}
            <strong>
              {nodes.find((n) => n.id === connectSourceNode)?.label}
            </strong>{' '}
            (Click another node to connect)
          </span>
        ) : (
          <span style={{ marginLeft: 10 }}>Click a node to select it</span>
        )}
      </div>

      {selectedNodeId && (
        <div
          style={{
            marginBottom: 10,
            border: '1px solid #ccc',
            padding: '8px',
            borderRadius: '6px',
            maxWidth: 300,
          }}
        >
          <strong>Selected Node:</strong>{' '}
          {nodes.find((n) => n.id === selectedNodeId)?.label || ''}
          <div style={{ marginTop: 8 }}>
            <label htmlFor="renameInput">Rename node:</label>
            <input
              id="renameInput"
              type="text"
              value={nodes.find((n) => n.id === selectedNodeId)?.label || ''}
              onChange={(e) => renameSelectedNode(e.target.value)}
              style={{ marginLeft: 10, width: '60%' }}
            />
          </div>
          <button
            onClick={deleteSelectedNode}
            style={{
              marginTop: 10,
              backgroundColor: '#e63946',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: 10,
            }}
          >
            Delete Node
          </button>

          <button
            onClick={startConnectionMode}
            disabled={connectSourceNode === selectedNodeId}
            style={{
              marginTop: 10,
              backgroundColor:
                connectSourceNode === selectedNodeId ? '#4CAF50' : '#2a9d8f',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: connectSourceNode === selectedNodeId ? 'default' : 'pointer',
            }}
          >
            {connectSourceNode === selectedNodeId
              ? 'Connecting...'
              : 'Connect'}
          </button>

          {outgoingConnections.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <strong>Remove connection:</strong>
              <ul style={{ paddingLeft: 20 }}>
                {outgoingConnections.map(({ edgeId, toNode }) => (
                  <li key={edgeId} style={{ marginBottom: 6 }}>
                    To <strong>{toNode.label}</strong>{' '}
                    <button
                      onClick={() => removeConnection(toNode.id)}
                      style={{
                        marginLeft: 8,
                        backgroundColor: '#d62828',
                        color: 'white',
                        border: 'none',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                      }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <svg
        ref={svgRef}
        width={600}
        height={400}
        style={{ border: '1px solid #ccc', background: '#f9f9f9', userSelect: 'none' }}
        onClick={() => {
          setSelectedNodeId(null);
          setConnectSourceNode(null);
        }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="10"
            refY="3.5"
            orient="auto"
            fill="#333"
          >
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
          <style>{`
            .edge:hover {
              stroke: #f00;
              stroke-width: 4 !important;
              cursor: pointer;
            }
            .node-circle.selected {
              stroke: orange;
              stroke-width: 4;
            }
          `}</style>
        </defs>

        {/* Edges */}
        {edges.map(({ id, from, to }) => {
          const fromNode = nodes.find((n) => n.id === from);
          const toNode = nodes.find((n) => n.id === to);
          if (!fromNode || !toNode) return null;

          const start = getCenter(fromNode);
          const end = getCenter(toNode);

          return (
            <line
              key={id}
              className="edge"
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="#333"
              strokeWidth={4}
              markerEnd="url(#arrowhead)"
              onClick={(e) => {
                e.stopPropagation();
                handleEdgeClick(id);
              }}
              style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map(({ id, label, x, y, radius, color }) => {
          const isSelected = selectedNodeId === id || connectSourceNode === id;
          const textColor = ['#f1faee', '#fff', '#fffff0'].includes(color)
            ? '#000'
            : '#fff';

          return (
            <g
              key={id}
              onMouseDown={(e) => handleMouseDown(e, id)}
              onClick={(e) => {
                e.stopPropagation();
                handleNodeClick(id);
              }}
              style={{ cursor: 'grab' }}
            >
              <circle
                className={`node-circle${isSelected ? ' selected' : ''}`}
                cx={x}
                cy={y}
                r={radius}
                fill={color}
                stroke="#333"
                strokeWidth={isSelected ? 4 : 2}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={16}
                fill={textColor}
                style={{ userSelect: 'none', pointerEvents: 'none', fontWeight: 'bold' }}
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Matrix preview */}
      <div style={{ marginTop: 20 }}>
        <h3>Adjacency Matrix Preview</h3>
        {nodes.length === 0 ? (
          <p>No nodes yet.</p>
        ) : (
          <table
            style={{
              borderCollapse: 'collapse',
              width: '100%',
              maxWidth: 600,
              textAlign: 'center',
              userSelect: 'none',
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: '1px solid #ccc',
                    padding: 6,
                    backgroundColor: '#f0f0f0',
                  }}
                >
                  From \ To
                </th>
                {nodes.map((col) => (
                  <th
                    key={col.id}
                    style={{
                      border: '1px solid #ccc',
                      padding: 6,
                      backgroundColor: '#f0f0f0',
                    }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {nodes.map((row, rowIndex) => (
                <tr key={row.id}>
                  <th
                    style={{
                      border: '1px solid #ccc',
                      padding: 6,
                      backgroundColor: '#f0f0f0',
                    }}
                  >
                    {row.label}
                  </th>
                  {adjacencyMatrix[rowIndex].map((cell, colIndex) => (
                    <td
                      key={`${row.id}-${nodes[colIndex].id}`}
                      style={{
                        border: '1px solid #ccc',
                        padding: 6,
                        backgroundColor: cell ? '#a6e3a1' : '#fff',
                        fontWeight: cell ? 'bold' : 'normal',
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Flowchart;
