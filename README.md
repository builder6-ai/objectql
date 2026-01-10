# ObjectOS (The Runtime Platform)

<div align="center">

**The Metadata-Driven Low-Code Engine.**
*Build Salesforce-class Enterprise Applications in minutes, not months.*

[Documentation](https://www.google.com/search?q=https://objectos.org) · [ObjectQL Protocol](https://www.google.com/search?q=https://github.com/objectql/objectql) · [Discussions](https://www.google.com/search?q=https://github.com/objectql/objectos/discussions)

</div>

---

## 📖 Introduction

**ObjectOS** is the high-performance application runtime built on top of the [ObjectQL Protocol](https://www.google.com/search?q=https://github.com/objectql/objectql).

While ObjectQL defines *how to describe data* (the Protocol & Drivers), **ObjectOS** defines *how to run the business* (the Platform). It provides a modular **Kernel**, a production-ready **HTTP Server**, and a rich ecosystem of **Plugins** to handle Authentication, Workflows, and Permissions.

**Think of it as:**

* **ObjectQL** is HTML (Standard).
* **ObjectOS** is Chrome (Engine).

## ✨ Key Features

* **🧠 Modular Micro-Kernel:** A pure logic engine that handles metadata loading, lifecycle hooks, and dependency injection. Framework agnostic.
* **🔌 Protocol Driven:** Natively understands `*.object.yml` files. Zero boilerplate for CRUD.
* **🛡️ Enterprise Security:** Built-in Row-Level Security (RLS) and Field-Level Security (FLS) powered by RBAC.
* **🧩 Preset System:** Instantly transform the engine into a CRM, ERP, or PM tool using pre-packaged metadata bundles (Presets).
* **⚡ High Performance:** Optimized for Node.js, supporting massive concurrency and serverless deployment.

---

## 🏗 Architecture

ObjectOS follows a strict **Onion Architecture**. The Kernel is the core, surrounded by Interface adapters (Server) and Infrastructure (Drivers/Plugins).

```mermaid
graph TD
    User((Client)) -->|REST / GraphQL| Server[@objectos/server]
    
    subgraph "ObjectOS Runtime"
        Server -->|Context| Kernel[@objectos/kernel]
        
        Kernel -->|Auth Logic| PluginAuth[@objectos/plugin-auth]
        Kernel -->|Workflow| PluginFlow[@objectos/plugin-workflow]
        
        Kernel -->|Load Metadata| Preset[@objectos/preset-steedos]
    end
    
    subgraph "ObjectQL Data Layer (External Repo)"
        Kernel -->|Dispatch Query| DriverPG[@objectql/driver-pg]
        Kernel -->|Dispatch Query| DriverMongo[@objectql/driver-mongo]
    end
    
    DriverPG --> DB[(PostgreSQL)]

```

---

## 📦 Packages Overview

This repository is a **Monorepo** managed by Turborepo.

### 1. The Core 

| Package | Description |
| --- | --- |
| **`@objectos/kernel`** | The brain. Manages object registry, triggers, and query dispatching. |
| **`@objectos/server`** | The gateway. A NestJS-based HTTP server exposing standard API endpoints. |

### 2. The Plugins

| Package | Description |
| --- | --- |
| **`@objectos/plugin-auth`** | Integration with **Better-Auth**. Handles Session, SSO, and 2FA. |
| **`@objectos/plugin-workflow`** | A BPMN-compatible workflow engine for approval processes. |
| **`@objectos/plugin-storage`** | File upload adapters for S3, OSS, and MinIO. |
| **`@objectos/plugin-script`** | Sandbox for running custom server-side scripts safely. |

### 3. The Presets 

| Package | Description |
| --- | --- |
| **`@objectos/preset-base`** | Minimal system objects (Users, Roles, Permissions). |
| **`@objectos/preset-steedos`** | **Steedos Compatible.** Full CRM metadata (Spaces, Orgs, Accounts). |
| **`@objectos/preset-iot`** | IoT specific objects (Devices, Telemetry, Alerts). |

---

## 🚀 Quick Start

Build a CRM in 30 seconds.

### 1. Install Dependencies

Note: We install the **Runtime** from here, and the **Driver** from the ObjectQL repo.

```bash
npm install @objectos/kernel @objectos/server @objectql/driver-pg

```

### 2. Create the Application (`main.ts`)

```typescript
import { ObjectOS } from '@objectos/kernel';
import { ObjectServer } from '@objectos/server';
// The Driver comes from the Protocol layer
import { PostgresDriver } from '@objectql/driver-pg'; 

async function bootstrap() {
  // 1. Initialize the Kernel
  const kernel = new ObjectOS();

  // 2. Mount the Driver (Kernel is database agnostic)
  const driver = new PostgresDriver({
    connection: process.env.DATABASE_URL
  });
  await driver.connect();
  kernel.useDriver(driver);

  // 3. Load Business Logic (Presets & Local Files)
  // This loads standard CRM objects like 'accounts', 'contacts'
  await kernel.loadPreset('@objectos/preset-steedos'); 
  
  // Load your custom objects
  await kernel.loadFromDirectory('./my-objects');

  // 4. Start the HTTP Server
  const server = new ObjectServer(kernel);
  await server.listen(3000);
  
  console.log('🚀 ObjectOS is running on http://localhost:3000');
}

bootstrap();

```

### 3. Consume the API

You now have a full CRUD API with filtering, sorting, and permissions.

```bash
curl -X POST http://localhost:3000/api/v4/accounts/query \
  -H "Content-Type: application/json" \
  -d '{
    "filters": [["annual_revenue", ">", 1000000]],
    "fields": ["name", "owner.name", "created_at"]
  }'

```

---

## 🤖 AI Strategy

ObjectOS is designed to be the **Execution Target** for AI.

Do not write boilerplate code. Use our **AI Context** (in `objectql` repo) to instruct LLMs (Cursor, Copilot) to:

1. Generate `*.object.yml` files from business requirements.
2. Write complex Formulas and Automation Rules.
3. Generate frontend code that consumes ObjectOS APIs.

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://www.google.com/search?q=CONTRIBUTING.md).

* **Bug Reports:** Open an issue here.
* **Protocol Changes:** Please go to [objectql/objectql](https://www.google.com/search?q=https://github.com/objectql/objectql).

## 📄 License

MIT © [ObjectOS Team](https://www.google.com/search?q=https://objectos.org)