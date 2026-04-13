/**
 * Available Service Library (Sidebar)
 * 
 * Provides an external list of AWS/Cloud services to instatiate into the canvas.
 * Implements HTML5 Drag and Drop events to transport service types.
 */
import type React from 'react';
import { Cpu, Server, Database, CloudCog, ArrowLeftRight } from 'lucide-react';
import type { AWSService, ServiceType } from '../../types';

interface ServiceDefinition {
  type: AWSService;
  serviceType: ServiceType;
  label: string;
  icon: React.ReactNode;
}

// Master component list simulating external discovery API or component registry
const SERVICES: ServiceDefinition[] = [
  { type: 'Lambda', serviceType: 'Compute', label: 'AWS Lambda', icon: <Cpu className="w-4 h-4"/> },
  { type: 'EC2', serviceType: 'Compute', label: 'EC2 Instance', icon: <Server className="w-4 h-4"/> },
  { type: 'RDS', serviceType: 'Storage', label: 'RDS Database', icon: <Database className="w-4 h-4"/> },
  { type: 'S3', serviceType: 'Storage', label: 'S3 Bucket', icon: <CloudCog className="w-4 h-4"/> },
  { type: 'APIGateway', serviceType: 'Network', label: 'API Gateway', icon: <ArrowLeftRight className="w-4 h-4"/> },
];

export const Sidebar = () => {
  /**
   * Encodes the drag event with local structural parameters
   */
  const onDragStart = (event: React.DragEvent, service: ServiceDefinition) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({
      type: service.type,
      serviceType: service.serviceType,
      label: service.label,
      config: {}
    }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 h-full bg-gray-900 border-r border-gray-800 flex flex-col pt-4 shrink-0 transition-all">
      <div className="px-5 mb-6 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-compute to-network">
        Architect
      </div>
      
      <div className="flex-1 overflow-y-auto px-3">
        <div className="mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">Components</div>
        <div className="space-y-2">
          {SERVICES.map((service) => (
            <div
              key={service.type}
              className="flex items-center gap-3 px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-md cursor-grab transition-colors"
              onDragStart={(e) => onDragStart(e, service)}
              draggable
            >
              <div className="text-gray-400">{service.icon}</div>
              <span className="text-sm text-gray-200">{service.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
