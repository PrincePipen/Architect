/**
 * Application Entry Point
 * 
 * Sets up the main split-pane layout for the Architect MVP.
 * Integrates the Canvas workspace, Sidebar component library,
 * Cost configuration header, and conditionally rendered Terraform editor.
 */
import { useState } from 'react';
import { Sidebar } from './components/sidebar/Sidebar';
import { ArchitectCanvas } from './components/canvas/ArchitectCanvas';
import { CodePreviewPanel } from './components/editor/CodePreviewPanel';
import { ConfigDrawer } from './components/drawer/ConfigDrawer';
import { useStore } from './store/useStore';
import { Play } from 'lucide-react';

function App() {
  // Local state for toggling the Infrastructure-as-Code panel
  const [showCode, setShowCode] = useState(false);
  
  // Global state selections for top-level header computations
  const { totalMonthlyCost, mockTraffic, setMockTraffic } = useStore();

  return (
    <div className="w-screen h-screen flex flex-col bg-canvas overflow-hidden text-gray-200">
      {/* 
        Global Header Navigation 
        Contains traffic simulation sliders and aggregated financial costs 
      */}
      <header className="h-14 border-b border-gray-800 bg-gray-900 flex items-center justify-between px-6 shrink-0 z-10 relative">
        <div className="flex items-center gap-4">
          <div className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-compute to-network">
            Architect
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Traffic Simulation Controller */}
          <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-md border border-gray-700">
            <Play className="w-4 h-4 text-green-500" />
            <span className="text-xs text-gray-400">Traffic Simulation:</span>
            <select 
              className="bg-transparent text-sm font-mono focus:outline-none cursor-pointer"
              value={mockTraffic}
              onChange={(e) => setMockTraffic(Number(e.target.value))}
            >
              <option value={1}>1 req/s</option>
              <option value={10}>10 req/s</option>
              <option value={100}>100 req/s</option>
              <option value={1000}>1,000 req/s</option>
            </select>
          </div>
          
          {/* Real-time Aggregated Architecture Cost */}
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-500 uppercase font-semibold">Total Projected Cost</span>
            <span className="font-mono text-lg font-bold text-gray-100">${totalMonthlyCost.toFixed(2)}/mo</span>
          </div>
          
          {/* IaC Toggle Trigger */}
          <button 
            onClick={() => setShowCode(!showCode)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-md transition-colors shadow-lg shadow-blue-900/20"
            aria-label="Toggle Code Preview"
          >
            {showCode ? 'Hide Code' : 'Generate Code'}
          </button>
        </div>
      </header>

      {/* 
        Main Workspace Grid 
        Divided into Flex columns preventing outer scroll overflow
      */}
      <main className="flex-1 flex overflow-hidden relative">
        <Sidebar />
        
        <div className="flex-1 relative flex overflow-hidden">
          <ArchitectCanvas />
          <ConfigDrawer />
        </div>

        {/* Right Pane Code Generation Viewer */}
        {showCode && <CodePreviewPanel />}
      </main>
    </div>
  );
}

export default App;
