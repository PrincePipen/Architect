/**
 * Service Node UI Component
 * 
 * Provides a universal draggable component rendered inside the ReactFlow layout.
 * Represents a discrete Cloud infrastructure component containing specific parameters.
 */
import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Cpu, Server, Database, CloudCog, ArrowLeftRight } from 'lucide-react';
import type { ServiceNodeData } from '../../types';

// Map specific node types to standard Lucide icons
const iconMap: Record<string, any> = {
  Lambda: <Cpu className="w-5 h-5" />,
  EC2: <Server className="w-5 h-5" />,
  RDS: <Database className="w-5 h-5" />,
  APIGateway: <ArrowLeftRight className="w-5 h-5" />,
  S3: <CloudCog className="w-5 h-5" />
};

// Provides semantic color variants (Orange for Compute, Green for Storage)
const colorMap: Record<string, string> = {
  Compute: 'border-compute text-compute bg-compute/10',
  Storage: 'border-storage text-storage bg-storage/10',
  Network: 'border-network text-network bg-network/10',
  Security: 'border-security text-security bg-security/10'
};

const ServiceNode = ({ data, selected }: { data: ServiceNodeData, selected: boolean }) => {
  return (
    <div className={`relative min-w-[150px] p-3 rounded-lg border-2 bg-canvas shadow-lg transition-all duration-200
      ${selected ? 'border-blue-500 shadow-[0_0_0_2px_rgba(52,152,219,0.3)]' : 'border-gray-700 hover:border-gray-500'}
      ${data.hasError ? 'border-red-500 shadow-[0_0_0_2px_rgba(231,76,60,0.3)]' : ''}`}>
      
      {/* Target Handle (Incoming connection port) */}
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-gray-400 border-2 border-canvas" />

      {/* Floating Cost Badge (Estimated Monthly Financial Impact) */}
      <div className="absolute -top-3 -right-2 px-2 py-0.5 bg-gray-800 border border-gray-600 rounded-full text-[10px] text-gray-300 font-mono shadow-sm">
        ${data.costPerMonth?.toFixed(2) || '0.00'}/mo
      </div>

      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-md border ${colorMap[data.serviceType] || colorMap.Compute}`}>
          {iconMap[data.type]}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-200">{data.label}</span>
          <span className="text-[10px] text-gray-500 font-mono">{data.type}</span>
        </div>
      </div>

      {/* Conditional Configuration Summary Rendering */}
      <div className="mt-2 text-[10px] text-gray-400 font-mono flex flex-col gap-0.5">
        {data.config.instanceType && <span>type: {data.config.instanceType}</span>}
        {data.config.storageGB && <span>storage: {data.config.storageGB}GB</span>}
      </div>

      {/* Source Handle (Outgoing connection port) */}
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-400 border-2 border-canvas" />
    </div>
  );
};

// Memoize node to prevent full DOM repaints during pan operations
export default memo(ServiceNode);
