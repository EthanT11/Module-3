import { StackPanel } from "@babylonjs/gui";
import { startScreenUIDimensions } from "../start_menu/startScreenConfig";

export const drawStack = (type: "top" | "bottom"): StackPanel => {
  const stack = new StackPanel();
  stack.isVertical = true;
  stack.paddingLeft = startScreenUIDimensions.PADDING;
  stack.paddingRight = startScreenUIDimensions.PADDING;
  stack.spacing = startScreenUIDimensions.SPACING;
  if (type === "top") {
    stack.width = startScreenUIDimensions.TOP_STACK.WIDTH;
    stack.height = startScreenUIDimensions.TOP_STACK.HEIGHT;
    stack.paddingTop = startScreenUIDimensions.PADDING;
  } else if (type === "bottom") {
    stack.width = startScreenUIDimensions.BOTTOM_STACK.WIDTH;
    stack.height = startScreenUIDimensions.BOTTOM_STACK.HEIGHT;
    stack.top = startScreenUIDimensions.BOTTOM_STACK.TOP;
  } else {
    throw new Error("Invalid stack type");
  }
  return stack;
}