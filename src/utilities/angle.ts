export function deflectAngle(
  incidentAngle: number,
  surfaceNormal: number
): number {
  // Ensure incident angle and surface normal are between 0 and 360 degrees
  const normalizedIncidentAngle: number = incidentAngle % 360;
  const normalizedSurfaceNormal: number = surfaceNormal % 360;

  // Calculate the reflected angle using the law of reflection
  const reflectedAngle: number =
    2 * normalizedSurfaceNormal - normalizedIncidentAngle;

  return reflectedAngle;
}
