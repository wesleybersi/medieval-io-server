interface Triangle {
  vertex1: { x: number; y: number };
  vertex2: { x: number; y: number };
  vertex3: { x: number; y: number };
}

function pointInTriangle(
  point: { x: number; y: number },
  triangle: Triangle
): boolean {
  const { x, y } = point;
  const { vertex1, vertex2, vertex3 } = triangle;

  const denominator =
    (vertex2.y - vertex3.y) * (vertex1.x - vertex3.x) +
    (vertex3.x - vertex2.x) * (vertex1.y - vertex3.y);
  const u =
    ((vertex2.y - vertex3.y) * (x - vertex3.x) +
      (vertex3.x - vertex2.x) * (y - vertex3.y)) /
    denominator;
  const v =
    ((vertex3.y - vertex1.y) * (x - vertex3.x) +
      (vertex1.x - vertex3.x) * (y - vertex3.y)) /
    denominator;
  const w = 1 - u - v;

  return u >= 0 && v >= 0 && w >= 0;
}

// Example usage:
const triangle: Triangle = {
  vertex1: { x: 0, y: 0 },
  vertex2: { x: 0, y: 100 },
  vertex3: { x: 100, y: 0 },
};

const pointToCheck: { x: number; y: number } = { x: 50, y: 50 };

const isColliding = pointInTriangle(pointToCheck, triangle);
console.log(isColliding);
