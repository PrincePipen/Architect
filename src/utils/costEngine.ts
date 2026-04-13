/**
 * Local-First Mock Pricing Engine
 * 
 * Provides static mapping of standardized AWS SKU rates per second or GB logic.
 * Enables zero-latency architectural tests simulating expensive external systems.
 */
import type { ArchitectNode } from '../types';

// Simplified pricing model matrix for development
const PRICING: Record<string, any> = {
  Lambda: { base: 0, perReq: 0.0000002 },
  EC2: { 
    't3.micro': 7.50,
    't3.medium': 30.00,
    'c5.large': 62.00
  },
  RDS: {
    'db.t3.micro': 12.50,
    'db.t3.medium': 50.00,
    'db.r5.large': 200.00
  },
  APIGateway: { base: 0, perReq: 0.0000035 },
  S3: { base: 0.023, perGBStorage: 0.023, perReq: 0.0000004 }
};

/**
 * Calculates raw isolated architecture node projection
 */
export const calculateNodeCost = (node: ArchitectNode, trafficRPS: number): number => {
  const requestsPerMonth = trafficRPS * 60 * 60 * 24 * 30; // 30 Day metric simulation
  
  switch(node.data.type) {
    case 'Lambda':
      return requestsPerMonth * (PRICING.Lambda.perReq);
    case 'APIGateway':
      return requestsPerMonth * (PRICING.APIGateway.perReq);
    case 'EC2':
      const instanceType = node.data.config.instanceType || 't3.micro';
      return PRICING.EC2[instanceType] || PRICING.EC2['t3.micro'];
    case 'RDS':
      const dbType = node.data.config.instanceType || 'db.t3.micro';
      return PRICING.RDS[dbType] || PRICING.RDS['db.t3.micro'];
    case 'S3':
      const storageGB = parseInt(node.data.config.storageGB || '100', 10);
      return (storageGB * PRICING.S3.perGBStorage) + (requestsPerMonth * PRICING.S3.perReq);
    default:
      return 0;
  }
};

/**
 * Calculates graph-wide aggregate 
 */
export const calculateTotalCost = (nodes: ArchitectNode[], trafficRPS: number): number => {
  return nodes.reduce((total, node) => total + calculateNodeCost(node, trafficRPS), 0);
};
