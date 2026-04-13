import type { Node, Edge } from 'reactflow';

export type ServiceType = 'Compute' | 'Storage' | 'Network' | 'Security';
export type AWSService = 'Lambda' | 'EC2' | 'RDS' | 'APIGateway' | 'S3';

export interface ServiceNodeData {
  type: AWSService;
  serviceType: ServiceType;
  label: string;
  config: Record<string, any>;
  costPerMonth?: number;
  hasError?: boolean;
}

export type ArchitectNode = Node<ServiceNodeData>;
export type ArchitectEdge = Edge;

export interface AppState {
  nodes: ArchitectNode[];
  edges: ArchitectEdge[];
  selectedNode: ArchitectNode | null;
  totalMonthlyCost: number;
  mockTraffic: number;
  
  // Actions
  setNodes: (nodes: ArchitectNode[] | ((nodes: ArchitectNode[]) => ArchitectNode[])) => void;
  setEdges: (edges: ArchitectEdge[] | ((edges: ArchitectEdge[]) => ArchitectEdge[])) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  addNode: (node: ArchitectNode) => void;
  updateNodeConfig: (id: string, config: any) => void;
  setSelectedNode: (node: ArchitectNode | null) => void;
  setMockTraffic: (reqPerSec: number) => void;
  calculateCosts: () => void;
}
