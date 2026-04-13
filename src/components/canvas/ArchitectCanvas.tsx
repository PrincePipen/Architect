/**
 * Architect Canvas Interface
 * 
 * Encapsulates the ReactFlow integration for mapping AWS nodes into a visual graph.
 * Handles drag-and-drop mechanics to spawn new architecture components
 * and emits node changes to the global Zustand store.
 */
import { useCallback, useRef, useState, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  ReactFlowProvider,
} from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import 'reactflow/dist/style.css';
import { useStore } from '../../store/useStore';
import ServiceNode from '../nodes/ServiceNode';

export const ArchitectCanvas = () => {
  // DOM references to intercept drag offsets accurately
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  
  // Zustand State Management Extractors
  const { 
    nodes, edges, onNodesChange, onEdgesChange, onConnect, 
    addNode, setSelectedNode 
  } = useStore();

  // Memoize custom node structures for ReactFlow to prevent redundant re-renders
  const nodeTypes = useMemo(() => ({ serviceNode: ServiceNode }), []);

  /**
   * Prepares the drag boundary surface by allowing pointer drop actions
   */
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  /**
   * Intercepts valid component drops, calculates pointer offsets natively, 
   * and spawns a specific node mapping the user's intent.
   */
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance || !reactFlowWrapper.current) return;
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const typeStr = event.dataTransfer.getData('application/reactflow');
      
      if (!typeStr) return;

      const serviceData = JSON.parse(typeStr);
      
      // Calculate normalized X/Y for infinite canvas offsets
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: uuidv4(),
        type: 'serviceNode',
        position,
        data: { ...serviceData },
      };

      addNode(newNode as any);
    },
    [reactFlowInstance, addNode]
  );
  
  /**
   * Identifies which node the user clicked to highlight and populate config drawer
   */
  const onSelectionChange = useCallback(({ nodes }: { nodes: any[] }) => {
    setSelectedNode(nodes.length === 1 ? nodes[0] : null);
  }, [setSelectedNode]);

  return (
    <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onSelectionChange={onSelectionChange}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid={true}
          snapGrid={[8, 8]}
          defaultViewport={{ zoom: 1, x: 0, y: 0 }}
          minZoom={0.1}
          maxZoom={3}
          className="bg-canvas"
        >
          {/* Theming utilities matching Dark CSS preferences */}
          <Background color="#2D3748" gap={16} size={1} />
          <Controls className="bg-gray-800 border-gray-700 fill-gray-300" />
          <MiniMap 
            nodeColor={(node: any) => {
              switch (node.data?.serviceType) {
                case 'Compute': return '#FF9900';
                case 'Storage': return '#1E8900';
                case 'Network': return '#9B59B6';
                case 'Security': return '#E74C3C';
                default: return '#eee';
              }
            }}
            maskColor="rgba(26, 26, 46, 0.7)"
            className="bg-gray-900 border border-gray-800"
          />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};
