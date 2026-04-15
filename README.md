# 🏗️ Architect

**Visual Infrastructure Designer & Cost Intelligence Platform**

Architect is a browser-based visual design tool that empowers developers to drag-and-drop cloud components (AWS Lambda, EC2, RDS, API Gateway, S3) onto a scalable canvas, intelligently connect them, and automatically synthesize production-ready Terraform configurations instantly. 

<br>

## 🚀 Key Features

*   **Infinite Canvas System:** High-performance, zoomable 60fps canvas utilizing ReactFlow mapping DOM nodes directly to architectural topologies.
*   **Intelligent Infrastructure-as-Code (IaC) Generation:** Real-time bi-directional translation that maps visual node states into syntactically valid `HCL` Code (Terraform) ready for `.tf` export.
*   **Local-First Cost Engine:** Embedded financial simulation algorithm converting node allocations (e.g., `t3.medium`) and global traffic estimates (`Req/S`) into real-time Cost projections displaying immediately as floating badges over architecture elements.
*   **Granular Node Configuration:** Slide-out drawer interfaces allowing modification of active cloud service parameters such as Storage GB and Instance Types.

## 🛠️ Technology Stack

*   **Frontend Library:** React 18+ (Vite tooling)
*   **Core Systems:** ReactFlow (Canvas), Zustand (State / Global History)
*   **Styling:** Custom TailwindCSS Design System implementation with deep Dark Mode.
*   **Code Interface:** `@monaco-editor/react` for split-pane HCL visualizations natively in the browser.
*   **Typing:** Strict Typescript specifications enforcing data node integrity.

## 💻 Local Development Setup

To test out Architect on your local machine, follow these instructions:

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/PrincePipen/architect.git
    cd architect
    ```

2.  **Install Dependencies**
    Ensure you install dependencies correctly via Node Package Manager:
    ```bash
    npm install
    ```

3.  **Start the Local Server**
    ```bash
    npm run dev
    ```
    Navigate to `http://localhost:5173` to test out the visual editor!

## 🧪 Documentation & Testing

*   The fundamental generation abstractions operate natively in the browser on `utils/terraformGenerator.ts` without relying on back-end parsing clusters, dramatically improving system latency.
