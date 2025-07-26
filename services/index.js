// Export all services from a single entry point
export * from "./authService";
export * from "./commentService";
export * from "./postService";
export * from "./userService";

// You can also create and export an API instance if needed
export { default as api } from "../utils/api";
