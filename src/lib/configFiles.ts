// configFiles.ts
// Utility module for Quick Config File Editor features:
// - File detection (.yaml, .yml, .json, .toml, .env, .ini, .conf, Dockerfile, etc.)
// - Real-time syntax validation (JSON parse, YAML tab/colon check)
// - Content formatting / prettifying
// - Special Custom Config Files storage (Name, Path, Description)

import type { SpecialConfigFile } from '../types';

export function isConfigFile(fileName: string): boolean {
  if (!fileName) return false;
  const lower = fileName.toLowerCase();
  const configExtensions = [
    '.yaml',
    '.yml',
    '.json',
    '.toml',
    '.env',
    '.ini',
    '.conf',
    '.config',
    '.properties',
    '.xml',
    '.editorconfig',
    '.prettierrc',
  ];
  const configNames = [
    'dockerfile',
    'makefile',
    'docker-compose.yml',
    'docker-compose.yaml',
    '.env.example',
    '.env.local',
    '.env.production',
    '.env.development',
    'tsconfig.json',
    'package.json',
    'cargo.toml',
  ];

  if (configNames.includes(lower)) return true;
  if (lower.startsWith('.env')) return true;
  return configExtensions.some((ext) => lower.endsWith(ext));
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateConfigSyntax(fileName: string, content: string): ValidationResult {
  if (!content.trim()) return { valid: true };
  const ext = fileName.split('.').pop()?.toLowerCase();
  const lowerName = fileName.toLowerCase();

  // JSON Validation
  if (ext === 'json') {
    try {
      JSON.parse(content);
      return { valid: true };
    } catch (e: any) {
      return { valid: false, error: e.message || 'Invalid JSON syntax' };
    }
  }

  // YAML Validation (Basic checks for tabs in indentation)
  if (ext === 'yaml' || ext === 'yml' || lowerName.includes('docker-compose')) {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Check tab character used in leading indent
      if (/^\s*\t+/.test(line)) {
        return {
          valid: false,
          error: `Line ${i + 1}: YAML forbids tab characters for indentation. Use spaces instead.`,
        };
      }
    }
    return { valid: true };
  }

  // ENV Validation (Key=Value format check)
  if (ext === 'env' || lowerName.startsWith('.env')) {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      if (!trimmed.includes('=')) {
        return {
          valid: false,
          error: `Line ${i + 1}: Missing '=' in key-value environment line.`,
        };
      }
    }
    return { valid: true };
  }

  return { valid: true };
}

export function formatConfigContent(
  fileName: string,
  content: string,
): { formatted: string; changed: boolean; error?: string } {
  const ext = fileName.split('.').pop()?.toLowerCase();

  if (ext === 'json') {
    try {
      const parsed = JSON.parse(content);
      const formatted = JSON.stringify(parsed, null, 2);
      return { formatted, changed: formatted !== content };
    } catch (e: any) {
      return { formatted: content, changed: false, error: 'Cannot format: ' + (e.message || 'Invalid JSON syntax') };
    }
  }

  // For YAML / TOML / ENV / INI: Trim trailing whitespaces and normalize line endings
  const lines = content.split(/\r?\n/);
  const cleaned = lines.map((l) => l.trimEnd()).join('\n');
  return { formatted: cleaned, changed: cleaned !== content };
}

// ---------------------------------------------------------------------------
// Special Config Files Storage
// ---------------------------------------------------------------------------

const SPECIAL_CONFIGS_KEY = 'clx-special-config-files';

export function loadSpecialConfigFiles(): SpecialConfigFile[] {
  try {
    const raw = localStorage.getItem(SPECIAL_CONFIGS_KEY);
    if (raw) return JSON.parse(raw) as SpecialConfigFile[];
  } catch {
    // ignore
  }
  return [
    {
      id: 'special-1',
      name: 'Docker Compose',
      path: 'docker-compose.yml',
      description: 'Cấu hình Docker containers, services & port mappings',
      group: 'Docker',
    },
    {
      id: 'special-2',
      name: 'Env Variables',
      path: '.env',
      description: 'Cấu hình biến môi trường và secret keys',
      group: 'Environment',
    },
    {
      id: 'special-3',
      name: 'App Config',
      path: 'config.yaml',
      description: 'Cấu hình hệ thống và dịch vụ chính',
      group: 'App Config',
    },
    {
      id: 'special-4',
      name: 'Package Manifest',
      path: 'package.json',
      description: 'Cấu hình dependencies và npx scripts',
      group: 'Node.js',
    },
  ];
}

export function saveSpecialConfigFile(entry: SpecialConfigFile): SpecialConfigFile[] {
  const current = loadSpecialConfigFiles();
  const index = current.findIndex((item) => item.id === entry.id);
  let updated: SpecialConfigFile[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = entry;
  } else {
    updated = [entry, ...current];
  }
  localStorage.setItem(SPECIAL_CONFIGS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('special-configs-changed', { detail: updated }));
  return updated;
}

export function deleteSpecialConfigFile(id: string): SpecialConfigFile[] {
  const current = loadSpecialConfigFiles();
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem(SPECIAL_CONFIGS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('special-configs-changed', { detail: updated }));
  return updated;
}
