/**
 * Main application data store using Zustand.
 * Provides granular architectural states including:
 * 1. Nodes (Infrastructural servers/functions)
 * 2. Edges (Security Groups/Interfacing links)
 * 3. Monthly simulated financial aggregates
 */
import { create } from 'zustand';
import type { AppState, ArchitectNode } from '../types';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import type { Connection, EdgeChange, NodeChange } from 'reactflow';
import { calculateTotalCost, calculateNodeCost } from '../utils/costEngine';

export const useStore = create<AppState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  totalMonthlyCost: 0,
  mockTraffic: 10,

  setNodes: (nodes) => set({ nodes: typeof nodes === 'function' ? nodes(get().nodes) : nodes }),
  setEdges: (edges) => set({ edges: typeof edges === 'function' ? edges(get().edges) : edges }),
  
  /**
   * Responds to node spatial movements or deletions
   */
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
    // Trigger localized cost recalibrations efficiently
    if (changes.some(c => c.type === 'remove' || c.type === 'add')) {
       get().calculateCosts();
    }
  },
  
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  
  /**
   * Injects new elements parsed from dropping onto the graph
   */
  addNode: (node: ArchitectNode) => {
    const nodeWithCost = {
      ...node,
      data: {
        ...node.data,
        costPerMonth: calculateNodeCost(node, get().mockTraffic)
      }
    };
    set({ nodes: [...get().nodes, nodeWithCost] });
    get().calculateCosts();
  },

  /**
   * Allows specific parameter adjustments like transitioning sizes of EC2 from Drawer UI
   */
  updateNodeConfig: (id: string, config: any) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          const updatedNode = { ...node, data: { ...node.data, config: { ...node.data.config, ...config } } };
          updatedNode.data.costPerMonth = calculateNodeCost(updatedNode, get().mockTraffic);
          return updatedNode;
        }
        return node;
      })
    });
    
    // Refresh selected state mapping immediately for Drawer interface
    if (get().selectedNode?.id === id) {
      set({ selectedNode: get().nodes.find(n => n.id === id) || null });
    }
    get().calculateCosts();
  },

  setSelectedNode: (node) => set({ selectedNode: node }),
  
  /**
   * Global traffic metric update forcing wide cost projections
   */
  setMockTraffic: (reqPerSec) => {
    set({ mockTraffic: reqPerSec });
    // Recalculates exact cost metrics for all nodes
    set({
      nodes: get().nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          costPerMonth: calculateNodeCost(node, reqPerSec)
        }
      }))
    });
    get().calculateCosts();
  },
  
  /**
   * Root aggregator
   */
  calculateCosts: () => {
    const { nodes, mockTraffic } = get();
    const total = calculateTotalCost(nodes, mockTraffic);
    set({ totalMonthlyCost: total });
  }
}));
