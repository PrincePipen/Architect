/**
 * Component Configuration Drawer
 * 
 * An absolute positioned slide-out drawer that activates when a user selects
 * an Architect node on the canvas. Provides specific form inputs depending 
 * on the active cloud service (e.g. Instance Type selectors for EC2 vs Memory for S3).
 */
import { useStore } from '../../store/useStore';

export const ConfigDrawer = () => {
  const { selectedNode, updateNodeConfig } = useStore();

  // Hide the drawer if no node is actively targeted by the user
  if (!selectedNode) return null;

  const data = selectedNode.data;

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 bg-gray-900 border-l border-gray-800 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 translate-x-0">
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-lg font-bold text-gray-100">{data.label} Configuration</h3>
        <p className="text-xs text-gray-500 font-mono mt-1">{data.type} • {selectedNode.id.split('-')[0]}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* EC2 or RDS Config Modifiers */}
        {(data.type === 'EC2' || data.type === 'RDS') && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase">Instance Type</label>
            <select 
              className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-sm text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={data.config.instanceType || (data.type === 'EC2' ? 't3.micro' : 'db.t3.micro')}
              onChange={(e) => updateNodeConfig(selectedNode.id, { instanceType: e.target.value })}
            >
              {data.type === 'EC2' ? (
                <>
                  <option value="t3.micro">t3.micro ($7.50/mo)</option>
                  <option value="t3.medium">t3.medium ($30.00/mo)</option>
                  <option value="c5.large">c5.large ($62.00/mo)</option>
                </>
              ) : (
                <>
                  <option value="db.t3.micro">db.t3.micro ($12.50/mo)</option>
                  <option value="db.t3.medium">db.t3.medium ($50.00/mo)</option>
                  <option value="db.r5.large">db.r5.large ($200.00/mo)</option>
                </>
              )}
            </select>
          </div>
        )}

        {/* S3 Config Modifiers */}
        {data.type === 'S3' && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase">Storage (GB)</label>
            <input 
              type="number"
              className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-sm text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              value={data.config.storageGB || 100}
              onChange={(e) => updateNodeConfig(selectedNode.id, { storageGB: Number(e.target.value) })}
            />
          </div>
        )}

        {/* Isolated Cost Estimation Panel for the Selected Node */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-compute/10 rounded-bl-full pointer-events-none" />
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Estimated Node Cost</div>
          <div className="text-3xl font-bold font-mono text-compute drop-shadow-md">
            ${data.costPerMonth?.toFixed(2) || '0.00'}
            <span className="text-sm text-gray-500">/mo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
