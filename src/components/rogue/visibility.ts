// 2D Line-of-Sight Raycasting Visibility Algorithm
import { Wall } from './types';

export interface Point {
  x: number;
  y: number;
}

export interface Segment {
  a: Point;
  b: Point;
}

export function wallsToSegments(walls: Wall[]): Segment[] {
  const segments: Segment[] = [];
  for (const w of walls) {
    const tl: Point = { x: w.x, y: w.y };
    const tr: Point = { x: w.x + w.w, y: w.y };
    const br: Point = { x: w.x + w.w, y: w.y + w.h };
    const bl: Point = { x: w.x, y: w.y + w.h };
    segments.push({ a: tl, b: tr });
    segments.push({ a: tr, b: br });
    segments.push({ a: br, b: bl });
    segments.push({ a: bl, b: tl });
  }
  return segments;
}

function getIntersection(
  rayOrigin: Point,
  rayAngle: number,
  seg: Segment
): { x: number; y: number; param: number } | null {
  const r_px = rayOrigin.x;
  const r_py = rayOrigin.y;
  const r_dx = Math.cos(rayAngle);
  const r_dy = Math.sin(rayAngle);

  const s_px = seg.a.x;
  const s_py = seg.a.y;
  const s_dx = seg.b.x - seg.a.x;
  const s_dy = seg.b.y - seg.a.y;

  const r_mag = Math.sqrt(r_dx * r_dx + r_dy * r_dy);
  const s_mag = Math.sqrt(s_dx * s_dx + s_dy * s_dy);
  if (r_dx / r_mag === s_dx / s_mag && r_dy / r_mag === s_dy / s_mag) {
    return null;
  }

  const denominator = s_dx * r_dy - s_dy * r_dx;
  if (denominator === 0) return null;

  const T2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / denominator;
  const T1 = (s_px + s_dx * T2 - r_px) / r_dx;

  if (T1 > 0 && T2 >= 0 && T2 <= 1) {
    return {
      x: r_px + r_dx * T1,
      y: r_py + r_dy * T1,
      param: T1,
    };
  }
  return null;
}

export function computeVisibilityPolygon(
  origin: Point,
  segments: Segment[],
  maxRadius: number = 450
): Point[] {
  const uniqueAngles: number[] = [];

  // Add bounding box segments for the max vision circle
  for (const seg of segments) {
    for (const pt of [seg.a, seg.b]) {
      const angle = Math.atan2(pt.y - origin.y, pt.x - origin.x);
      uniqueAngles.push(angle - 0.0001, angle, angle + 0.0001);
    }
  }

  // Also add regular radial angles for smooth circle bounds
  const steps = 48;
  for (let i = 0; i < steps; i++) {
    uniqueAngles.push((i / steps) * Math.PI * 2);
  }

  const intersects: { point: Point; angle: number; dist: number }[] = [];

  for (const angle of uniqueAngles) {
    let closestIntersect: { x: number; y: number; param: number } | null = null;

    for (const seg of segments) {
      const intersect = getIntersection(origin, angle, seg);
      if (!intersect) continue;
      if (intersect.param > maxRadius) continue;

      if (!closestIntersect || intersect.param < closestIntersect.param) {
        closestIntersect = intersect;
      }
    }

    if (!closestIntersect) {
      // Clamped to max radius
      closestIntersect = {
        x: origin.x + Math.cos(angle) * maxRadius,
        y: origin.y + Math.sin(angle) * maxRadius,
        param: maxRadius,
      };
    }

    intersects.push({
      point: { x: closestIntersect.x, y: closestIntersect.y },
      angle,
      dist: closestIntersect.param,
    });
  }

  intersects.sort((a, b) => a.angle - b.angle);
  return intersects.map((i) => i.point);
}
