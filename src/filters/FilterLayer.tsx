import type { IImageFilter } from './IImageFilter';

/**
 * Represents a single filter layer in the layer stack
 * Each layer wraps an IImageFilter instance with additional metadata
 */
export interface FilterLayer {
    /** Unique instance ID for this layer */
    id: string;

    /** The filter instance */
    filter: IImageFilter;

    /** Whether this layer is currently enabled */
    enabled: boolean;

    /** Display name for this layer */
    name: string;
}

/**
 * Generate a unique ID for a new filter layer
 */
export function generateLayerId(): string {
    return `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a new filter layer from a filter instance
 */
export function createFilterLayer(filter: IImageFilter, index: number): FilterLayer {
    return {
        id: generateLayerId(),
        filter: filter.clone(), // Clone to avoid sharing state
        enabled: true,
        name: `${filter.name} ${index + 1}`
    };
}