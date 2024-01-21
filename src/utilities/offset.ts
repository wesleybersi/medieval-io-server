export function getAngleOffset(
  x: number,
  y: number,
  angle: number,
  offset: number
) {
  const deltaX = Math.cos(angle * (Math.PI / 180));
  const deltaY = Math.sin(angle * (Math.PI / 180));
  const initialX = x + deltaX * offset;
  const initialY = y + deltaY * offset;

  return { x: initialX, y: initialY };
}
