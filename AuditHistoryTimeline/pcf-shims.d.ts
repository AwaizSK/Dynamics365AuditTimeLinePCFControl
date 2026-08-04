declare namespace ComponentFramework {
  type Dictionary = Record<string, unknown>;

  type IEventBag = Record<string, unknown>;

  interface Context<TInputs = unknown, TEvents = IEventBag> extends Record<string, unknown> {
    page?: {
      entityId?: string;
      entityTypeName?: string;
    };
    webAPI?: {
      retrieveMultipleRecords: (entityName: string, filter: string) => Promise<{
        entities: Record<string, unknown>[];
      }>;
    };
  }

  interface ReactControl<TInputs, TOutputs, TEvents = IEventBag> {
    init(context: Context<TInputs, TEvents>, notifyOutputChanged: () => void, state: Dictionary): void;
    updateView(context: Context<TInputs, TEvents>): React.ReactElement;
    getOutputs(): TOutputs;
    destroy(): void;
  }
}
