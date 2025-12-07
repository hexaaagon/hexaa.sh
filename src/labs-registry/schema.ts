export interface RegistryFile {
  path: string;
  content?: string;
  type:
    | "registry:ui"
    | "registry:component"
    | "registry:hook"
    | "registry:lib"
    | "registry:example";
  target?: string;
}

export interface RegistryItem {
  name: string;
  description?: string;
  type: RegistryFile["type"];
  files: (string | RegistryFile)[];
  dependencies?: string[];
  registryDependencies?: string[];
  categories?: string[];
  meta?: Record<string, unknown>;
  tailwind?: {
    config?: Record<string, unknown>;
  };
  cssVars?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
}

export interface Registry {
  items: RegistryItem[];
}

export interface RegistryEntryFile {
  path: string;
  type: string;
  target?: string;
}

export type RegistryEntry = {
  name: string;
  description: string;
  type: string;
  registryDependencies: string[];
  files: RegistryEntryFile[];
  component: React.ComponentType;
  categories: string[];
  meta: Record<string, unknown>;
};
