/**
 * Simple icon replacements using React Native Text
 * Temporary solution until lucide-react-native compatibility is resolved
 */

import React from 'react';
import { Text } from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
}

export const Check = ({ size = 16, color = '#000' }: IconProps) => (
  <Text style={{ fontSize: size, color }}>✓</Text>
);

export const X = ({ size = 16, color = '#000' }: IconProps) => (
  <Text style={{ fontSize: size, color }}>✕</Text>
);

export const ChevronDown = ({ size = 16, color = '#000' }: IconProps) => (
  <Text style={{ fontSize: size, color }}>▼</Text>
);

export const ChevronUp = ({ size = 16, color = '#000' }: IconProps) => (
  <Text style={{ fontSize: size, color }}>▲</Text>
);

export const ChevronLeft = ({ size = 16, color = '#000' }: IconProps) => (
  <Text style={{ fontSize: size, color }}>◀</Text>
);

export const ChevronRight = ({ size = 16, color = '#000' }: IconProps) => (
  <Text style={{ fontSize: size, color }}>▶</Text>
);

export const Circle = ({ size = 16, color = '#000', fill }: IconProps & { fill?: string }) => (
  <Text style={{ fontSize: size, color: fill || color }}>●</Text>
);

export const PanelLeft = ({ size = 16, color = '#000' }: IconProps) => (
  <Text style={{ fontSize: size, color }}>☰</Text>
);

export const GripVertical = ({ size = 16, color = '#000' }: IconProps) => (
  <Text style={{ fontSize: size, color }}>⋮</Text>
);

export const MoreHorizontal = ({ size = 16, color = '#000' }: IconProps) => (
  <Text style={{ fontSize: size, color }}>⋯</Text>
);

export const ArrowLeft = ({ size = 16, color = '#000' }: IconProps) => (
  <Text style={{ fontSize: size, color }}>←</Text>
);
