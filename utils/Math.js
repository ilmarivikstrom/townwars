export function formatCompactNumber(number) {
    number = Math.round(number);
    if (number >= 1000) {
        const thousands = number / 1000;
        return thousands.toFixed(1) + "k";
    }
    return number.toString();
}
export function findNodeAtPoint(nodes, x, y) {
    for (const node of nodes) {
        const circle = new Phaser.Geom.Circle(node.x, node.y, node.radius);
        if (Phaser.Geom.Circle.Contains(circle, x, y)) {
            return node;
        }
    }
    return null;
}
export function nodeContainsPoint(node, x, y) {
    const circle = new Phaser.Geom.Circle(node.x, node.y, node.radius);
    return Phaser.Geom.Circle.Contains(circle, x, y);
}
export function integerToRoman(num) {
    const romanValues = {
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
//# sourceMappingURL=Math.js.map