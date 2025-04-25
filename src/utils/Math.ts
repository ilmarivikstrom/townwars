import Node from "../entities/Node.js";

export function formatCompactNumber(number: number) {
  number = Math.round(number);
  if (number >= 1000) {
    const thousands = number / 1000;
    return thousands.toFixed(1) + "k";
  }
  return number.toString();
}

export function findNodeAtPoint(
  nodes: Node[],
  x: number,
  y: number
): Node | null {
  for (const node of nodes) {
    const circle = new Phaser.Geom.Circle(node.x, node.y, node.radius);
    if (Phaser.Geom.Circle.Contains(circle, x, y)) {
      return node;
    }
  }
  return null;
}

export function nodeContainsPoint(node: Node, x: number, y: number): boolean {
  const circle = new Phaser.Geom.Circle(node.x, node.y, node.radius);
  return Phaser.Geom.Circle.Contains(circle, x, y);
}
