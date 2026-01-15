import { ReactNode } from "react";
import { SpotlightItem } from "../types";

export interface RouteConfig {
  path: string;
  label?: string; // or name/title
  name?: string;
  title?: string;
  description?: string;
  icon?: ReactNode;
  children?: RouteConfig[];
  /**
   * Hide this route from spotlight search
   */
  hidden?: boolean;
  // Add other common router properties here as needed
  [key: string]: unknown;
}

/**
 * Recursively extracts spotlight items from a route configuration.
 * @param routes The list of routes to traverse.
 * @param baseUrl The base URL for the current level (used for recursion).
 * @param parentGroup The group name to assign (defaults to "Pages").
 */
export function getSpotlightItemsFromRoutes(
  routes: RouteConfig[],
  baseUrl = "",
  parentGroup = "Pages"
): SpotlightItem[] {
  const items: SpotlightItem[] = [];

  routes.forEach((route) => {
    // Construct full path
    const path = route.path.startsWith("/")
      ? route.path
      : `${baseUrl}/${route.path}`.replace(/\/+/g, "/");

    // Determine label
    const label: string = route.label || route.name || route.title || path;

    // Skip if route is marked as hidden
    if (route.hidden) {
      // Still process children
      if (route.children) {
        items.push(
          ...getSpotlightItemsFromRoutes(route.children, path, parentGroup)
        );
      }
      return;
    }

    // Create item if it has a label and isn't just a layout wrapper (optional logic)
    if (label && !route.children) {
      items.push({
        id: `route-${path}`,
        label,
        description: route.description || `Navigate to ${label}`,
        route: path,
        type: "page",
        group: parentGroup,
        icon: route.icon,
        keywords: [label, path], // Add more keywords if available
      });
    }

    // Recursively handle children
    if (route.children) {
      items.push(
        ...getSpotlightItemsFromRoutes(route.children, path, parentGroup)
      );
    }
  });

  return items;
}
