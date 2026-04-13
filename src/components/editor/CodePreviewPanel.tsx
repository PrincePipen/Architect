/**
 * Infrastructure As Code (IaC) Preview Panel
 * 
 * Loads a continuous instance of the Monaco code editor.
 * Listens to alterations inside the Zustand graph to dynamically
 * rebuild valid Terraform definitions in real time.
 */
import { useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { useStore } from '../../store/useStore';
import { generateTerraform } from '../../utils/terraformGenerator';

export const CodePreviewPanel = () => {
  const { nodes, edges } = useStore();
  
  // Re-generate the massive Terraform tree only when structural nodes or paths change
  const tfCode = useMemo(() => generateTerraform(nodes, edges), [nodes, edges]);

  return (
    <div className="w-1/3 min-w-[300px] h-full bg-gray-900 border-l border-gray-800 flex flex-col shrink-0 fade-in-animation">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Infrastructure as Code</h2>
        <div className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Terraform (HCL)</div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language="yaml" // Fallback language parsing to approximate HCL syntax highlight
          theme="vs-dark"
          value={tfCode}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: 'JetBrains Mono',
            padding: { top: 16 }
          }}
        />
      </div>
    </div>
  );
};
