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

export function integerToRoman(num: number) {
  const romanValues: Record<string, number> = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
  };
  let roman = "";
  for (const key in romanValues) {
    while (num >= romanValues[key]) {
      roman += key;
      num -= romanValues[key];
    }
  }
  return roman;
}
