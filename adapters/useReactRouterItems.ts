import { RouteObject } from "react-router-dom";
import { SpotlightItem, SpotlightItemType } from "../types";

/**
 * Interface for React Router handle metadata
 * Use this to add spotlight metadata to your routes
 * 
 * @example
 * ```tsx
 * {
 *   path: '/dashboard',
 *   element: <Dashboard />,
 *   handle: {
 *     spotlight: {
 *       label: 'Dashboard',
 *       description: 'View your dashboard',
 *       icon: <HomeIcon />,
 *       keywords: ['home', 'overview']
 *     }
 *   }
 * }
 * ```
 */
export interface RouterHandle {
  spotlight?: {
    label: string;
    icon?: React.ReactNode;
    description?: string;
    keywords?: string[];
    type?: SpotlightItemType;
  };
}

/**
 * Recursively extracts spotlight items from route configuration
 * @param routes The React Router route definitions
 * @param parentPath The path accumulator for recursion
 */
export function getSpotlightItemsFromRoutes(
  routes: RouteObject[],
  parentPath = ""
): SpotlightItem[] {
  let items: SpotlightItem[] = [];

  routes.forEach((route) => {
    // Determine the full path for this route
    let currentPath = route.path || "";

    // Clean up slashes
    if (parentPath.endsWith("/") && currentPath.startsWith("/")) {
      currentPath = currentPath.slice(1);
    } else if (
      !parentPath.endsWith("/") &&
      !currentPath.startsWith("/") &&
      currentPath
    ) {
      currentPath = `/${currentPath}`;
    }

    // Combine path (if the route is not an index route with no path)
    const fullPath = route.index ? parentPath : `${parentPath}${currentPath}`;

    // Extract handle if it exists
    const handle = route.handle as RouterHandle | undefined;

    if (handle?.spotlight) {
      items.push({
        id: `route-${fullPath}`, // Unique ID based on path
        label: handle.spotlight.label,
        description: handle.spotlight.description,
        icon: handle.spotlight.icon,
        type: (handle.spotlight.type || "page") as SpotlightItemType,
        keywords: handle.spotlight.keywords,
        route: fullPath,
        group: "Pages",
      });
    }

    // Recurse into children
    if (route.children) {
      items = [
        ...items,
        ...getSpotlightItemsFromRoutes(route.children, fullPath),
      ];
    }
  });

  return items;
}
