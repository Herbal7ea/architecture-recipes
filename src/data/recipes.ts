export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  complexity: "beginner" | "intermediate" | "advanced";
  tags: string[];
  diagram: string;
  steps: Step[];
  tradeoffs: { pros: string[]; cons: string[] };
  useCases: string[];
}

export interface Step {
  id: number;
  title: string;
  description: string;
  code?: string;
  files?: string[];
}

export const categories = [
  { id: "data", label: "Data Flow", icon: "Database" },
  { id: "ui", label: "UI Patterns", icon: "Layout" },
  { id: "infra", label: "Infrastructure", icon: "Server" },
  { id: "testing", label: "Testing", icon: "TestTube" },
];

export const recipes: Recipe[] = [
  {
    id: "vertical-slice",
    title: "Vertical Slice Architecture",
    subtitle: "Feature-oriented code organization",
    description:
      "Organize code by feature rather than technical layer. Each slice contains everything needed for a single feature — from API endpoint to UI component — making features independently deployable and easy to reason about.",
    category: "infra",
    complexity: "intermediate",
    tags: ["organization", "modularity", "CQRS"],
    diagram: `┌─────────────────────────────────────┐
│            Feature Slice            │
├──────────┬──────────┬───────────────┤
│   UI     │  Logic   │  Data Access  │
│ Component│  Handler │  Repository   │
└──────────┴──────────┴───────────────┘`,
    steps: [
      {
        id: 1,
        title: "Define the feature boundary",
        description:
          "Identify a discrete user-facing capability. Create a folder for the feature that will contain all related code.",
        files: ["src/features/create-order/"],
      },
      {
        id: 2,
        title: "Create the request/response models",
        description:
          "Define the data shapes that flow through this slice.",
        code: `// src/features/create-order/types.ts
export interface CreateOrderRequest {
  items: { productId: string; qty: number }[];
  shippingAddress: Address;
}

export interface CreateOrderResponse {
  orderId: string;
  estimatedDelivery: Date;
}`,
      },
      {
        id: 3,
        title: "Implement the handler",
        description:
          "Write the core logic as a single handler function that processes the request.",
        code: `// src/features/create-order/handler.ts
export async function handleCreateOrder(
  req: CreateOrderRequest
): Promise<CreateOrderResponse> {
  const order = await db.orders.create(req);
  await notifyWarehouse(order);
  return { orderId: order.id, estimatedDelivery: order.eta };
}`,
      },
      {
        id: 4,
        title: "Wire the UI component",
        description:
          "Build a component that calls the handler and presents the result.",
        code: `// src/features/create-order/CreateOrderForm.tsx
export function CreateOrderForm() {
  const mutation = useMutation(handleCreateOrder);
  return <form onSubmit={...}>...</form>;
}`,
      },
    ],
    tradeoffs: {
      pros: [
        "Features are self-contained and easy to find",
        "Low coupling between features",
        "Easy to delete or replace a feature",
        "New developers onboard faster",
      ],
      cons: [
        "Shared utilities need clear ownership",
        "Cross-cutting concerns require conventions",
        "Can lead to duplication if not managed",
      ],
    },
    useCases: [
      "Medium-to-large applications with distinct features",
      "Teams that want to ship features independently",
      "Codebases migrating from layered architecture",
    ],
  },
  {
    id: "event-driven",
    title: "Event-Driven State Management",
    subtitle: "Decouple state changes with events",
    description:
      "Use an event bus or pub/sub pattern to manage application state. Components emit events when things happen and subscribe to events they care about, reducing direct dependencies.",
    category: "data",
    complexity: "intermediate",
    tags: ["state", "events", "decoupling"],
    diagram: `┌──────┐  emit   ┌───────────┐  notify  ┌──────────┐
│ UI   │───────▶│ Event Bus │────────▶│ Handlers │
└──────┘        └───────────┘         └──────────┘
                     │
                     ▼
               ┌───────────┐
               │   Store   │
               └───────────┘`,
    steps: [
      {
        id: 1,
        title: "Create the event bus",
        description: "A simple typed pub/sub mechanism.",
        code: `type Handler<T> = (event: T) => void;

class EventBus {
  private handlers = new Map<string, Set<Handler<any>>>();
  
  on<T>(type: string, handler: Handler<T>) {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    this.handlers.get(type)!.add(handler);
  }
  
  emit<T>(type: string, payload: T) {
    this.handlers.get(type)?.forEach(h => h(payload));
  }
}`,
      },
      {
        id: 2,
        title: "Define domain events",
        description: "Create typed event definitions for your domain.",
        code: `interface CartItemAdded { productId: string; qty: number; }
interface OrderPlaced { orderId: string; total: number; }`,
      },
      {
        id: 3,
        title: "Subscribe handlers",
        description: "Wire up side effects as event handlers.",
        code: `bus.on<CartItemAdded>('cart:item-added', (e) => {
  analytics.track('add_to_cart', e);
  inventory.reserve(e.productId, e.qty);
});`,
      },
    ],
    tradeoffs: {
      pros: [
        "Very loose coupling between components",
        "Easy to add new behaviors to existing events",
        "Great for cross-cutting concerns like analytics",
      ],
      cons: [
        "Harder to trace execution flow",
        "Event ordering can be tricky",
        "Debugging requires good tooling",
      ],
    },
    useCases: [
      "Apps with many cross-cutting side effects",
      "Plugin architectures",
      "Real-time collaborative features",
    ],
  },
  {
    id: "compound-components",
    title: "Compound Components",
    subtitle: "Flexible, composable UI building blocks",
    description:
      "Build UI components that work together implicitly through shared context, like HTML's <select> and <option>. Users compose behavior by arranging sub-components rather than passing complex props.",
    category: "ui",
    complexity: "intermediate",
    tags: ["react", "composition", "components"],
    diagram: `<Tabs>                    ┌─────────────────┐
  <Tabs.List>             │  Tabs Context    │
    <Tabs.Trigger />      │  ┌─activeTab     │
    <Tabs.Trigger />      │  ┌─setActive     │
  </Tabs.List>            └─────────────────┘
  <Tabs.Content />               ▲
  <Tabs.Content />         (implicit sharing)
</Tabs>`,
    steps: [
      {
        id: 1,
        title: "Create shared context",
        description: "Define the state that sub-components share.",
        code: `const TabsContext = createContext<{
  activeTab: string;
  setActiveTab: (id: string) => void;
} | null>(null);`,
      },
      {
        id: 2,
        title: "Build the root component",
        description: "The root manages state and provides context.",
        code: `function Tabs({ children, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}`,
      },
      {
        id: 3,
        title: "Create sub-components",
        description: "Each reads from shared context.",
        code: `Tabs.Trigger = ({ id, children }) => {
  const { activeTab, setActiveTab } = useTabsContext();
  return (
    <button
      data-active={activeTab === id}
      onClick={() => setActiveTab(id)}
    >{children}</button>
  );
};`,
      },
    ],
    tradeoffs: {
      pros: [
        "Highly flexible API for consumers",
        "Inversion of control — users decide layout",
        "Clean separation of sub-component logic",
      ],
      cons: [
        "More boilerplate to set up",
        "Context can cause unnecessary re-renders",
        "API surface is implicit, less discoverable",
      ],
    },
    useCases: [
      "Design system components",
      "Complex interactive widgets (tabs, accordions, menus)",
      "Any component where layout should be user-controlled",
    ],
  },
  {
    id: "testing-diamond",
    title: "Testing Diamond Strategy",
    subtitle: "Integration-heavy test distribution",
    description:
      "Instead of the traditional test pyramid, emphasize integration tests that cover realistic user flows. Fewer unit tests, more integration tests, and a few E2E tests for critical paths.",
    category: "testing",
    complexity: "beginner",
    tags: ["testing", "strategy", "quality"],
    diagram: `        ╱╲
       ╱E2E╲        ← Few critical paths
      ╱──────╲
     ╱ Integr. ╲    ← Most tests here
    ╱────────────╲
     ╲  Unit   ╱    ← Focused utilities
      ╲───────╱`,
    steps: [
      {
        id: 1,
        title: "Identify critical user journeys",
        description:
          "Map the 3-5 most important flows users take through your app.",
      },
      {
        id: 2,
        title: "Write integration tests for each journey",
        description: "Test realistic scenarios with real-ish dependencies.",
        code: `test('user can create and submit an order', async () => {
  render(<App />);
  await user.click(screen.getByText('New Order'));
  await user.type(screen.getByLabelText('Product'), 'Widget');
  await user.click(screen.getByText('Submit'));
  expect(screen.getByText('Order confirmed')).toBeVisible();
});`,
      },
      {
        id: 3,
        title: "Add unit tests for pure logic",
        description: "Only unit-test complex calculations or transformations.",
        code: `test('calculates discount correctly', () => {
  expect(calculateDiscount({ subtotal: 100, code: 'SAVE20' }))
    .toEqual({ amount: 20, newTotal: 80 });
});`,
      },
    ],
    tradeoffs: {
      pros: [
        "Tests reflect real user behavior",
        "Catches integration bugs early",
        "Fewer mocks and stubs to maintain",
      ],
      cons: [
        "Integration tests are slower",
        "Failures can be harder to pinpoint",
        "Requires good test infrastructure",
      ],
    },
    useCases: [
      "Web applications with complex user flows",
      "Teams moving away from excessive mocking",
      "Projects prioritizing confidence over speed",
    ],
  },
];
