import { tFeedback as trFeedback, t as tr } from '../i18n';
import { useCallback, useEffect, useState } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { listDirectoryFiles } from '../lib/tauri';
import type { FileEntry, SpecialConfigFile } from '../types';

interface SpecialConfigModalProps {
  isOpen: boolean;
  initialConfig: SpecialConfigFile | null;
  rootPath?: string | null;
  onClose: () => void;
  onSave: (entry: SpecialConfigFile) => void;
}

function toRelativePath(fullPath: string, root: string | null | undefined): string {
  if (!root) return fullPath;
  const normalizedFull = fullPath.replace(/\\/g, '/');
  const normalizedRoot = root.replace(/\\/g, '/').replace(/\/+$/, '');
  if (normalizedFull.startsWith(normalizedRoot + '/')) {
    return normalizedFull.slice(normalizedRoot.length + 1);
  }
  return fullPath;
}

function isConfigFile(name: string): boolean {
  const ext = name.split('.').pop()?.toLowerCase();
  return [
    'json', 'yaml', 'yml', 'toml', 'env', 'conf', 'config', 'ini', 'xml',
    'properties', 'sh', 'bat', 'cmd', 'ps1', 'js', 'ts', 'mjs', 'cjs'
  ].includes(ext || '') || name.startsWith('.env');
}

export function SpecialConfigModal({
  isOpen,
  initialConfig,
  rootPath,
  onClose,
  onSave,
}: SpecialConfigModalProps) {
  const [name, setName] = useState('');
  const [path, setPath] = useState('');
  const [description, setDescription] = useState('');
  const [group, setGroup] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Directory UI state
  const [treeOpen, setTreeOpen] = useState(false);
  const [treeFilter, setTreeFilter] = useState('');
  const [dirCache, setDirCache] = useState<Record<string, FileEntry[]>>({});
  const [expandedDirs, setExpandedDirs] = useState<Record<string, boolean>>({});
  const [loadingDirs, setLoadingDirs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isOpen) return;
    setName(initialConfig?.name ?? '');
    setPath(initialConfig?.path ?? '');
    setDescription(initialConfig?.description ?? '');
    setGroup(initialConfig?.group ?? '');
    setError(null);
    setTreeOpen(false);
    setTreeFilter('');
  }, [initialConfig, isOpen]);

  const loadDirectory = useCallback(async (dirPath: string) => {
    if (dirCache[dirPath] || loadingDirs[dirPath]) return;
    setLoadingDirs((prev) => ({ ...prev, [dirPath]: true }));
    try {
      const entries = await listDirectoryFiles(dirPath);
      const sorted = [...entries].sort((a, b) => {
        if (a.isDir === b.isDir) return a.name.localeCompare(b.name);
        return a.isDir ? -1 : 1;
      });
      setDirCache((prev) => ({ ...prev, [dirPath]: sorted }));
    } catch (err) {
      console.error('Failed to load directory:', dirPath, err);
    } finally {
      setLoadingDirs((prev) => ({ ...prev, [dirPath]: false }));
    }
  }, [dirCache, loadingDirs]);

  // Load root directory when tree is opened
  useEffect(() => {
    if (treeOpen && rootPath && !dirCache[rootPath]) {
      void loadDirectory(rootPath);
      setExpandedDirs((prev) => ({ ...prev, [rootPath]: true }));
    }
  }, [treeOpen, rootPath, dirCache, loadDirectory]);

  if (!isOpen) return null;

  const handlePickNativeFolder = async () => {
    try {
      const picked = await open({
        directory: true,
        multiple: false,
        defaultPath: rootPath || undefined,
        title: tr("Select Folder for Config"),
      });
      if (typeof picked === 'string') {
        const rel = toRelativePath(picked, rootPath);
        setPath(rel);
        if (!name.trim()) {
          const folderName = picked.split(/[/\\]/).pop() || picked;
          setName(folderName);
        }
      }
    } catch (err) {
      console.error('Failed to pick folder:', err);
    }
  };

  const handlePickNativeFile = async () => {
    try {
      const picked = await open({
        directory: false,
        multiple: false,
        defaultPath: rootPath || undefined,
        title: tr("Select Config File"),
      });
      if (typeof picked === 'string') {
        const rel = toRelativePath(picked, rootPath);
        setPath(rel);
        if (!name.trim()) {
          const fileName = picked.split(/[/\\]/).pop() || picked;
          setName(fileName);
        }
      }
    } catch (err) {
      console.error('Failed to pick file:', err);
    }
  };

  const handleSelectEntry = (entry: FileEntry) => {
    const rel = toRelativePath(entry.path, rootPath);
    setPath(rel);
    if (!name.trim()) {
      setName(entry.name);
    }
  };

  const toggleDirectory = (dirPath: string) => {
    const isExpanded = !!expandedDirs[dirPath];
    if (!isExpanded && !dirCache[dirPath]) {
      void loadDirectory(dirPath);
    }
    setExpandedDirs((prev) => ({ ...prev, [dirPath]: !isExpanded }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a config name.');
      return;
    }
    if (!path.trim()) {
      setError('Please enter a file path.');
      return;
    }

    onSave({
      id: initialConfig?.id || `special-${Date.now()}`,
      name: name.trim(),
      path: path.trim(),
      description: description.trim(),
      group: group.trim() || undefined,
    });
    onClose();
  };

  // Recursive tree node renderer
  const renderDirectoryTree = (currentDir: string, depth = 0) => {
    const entries = dirCache[currentDir] || [];
    const isLoading = !!loadingDirs[currentDir];

    const filtered = treeFilter.trim()
      ? entries.filter((e) => e.name.toLowerCase().includes(treeFilter.toLowerCase()) || e.isDir)
      : entries;

    if (isLoading) {
      return (
        <div style={{ paddingLeft: `${depth * 14 + 16}px` }} className="py-1 text-[11px] text-slate-400 font-mono italic">
          {tr("Loading...")}
        </div>
      );
    }

    if (filtered.length === 0) {
      return (
        <div style={{ paddingLeft: `${depth * 14 + 16}px` }} className="py-1 text-[10px] text-slate-500 font-mono">
          {tr("Empty")}
        </div>
      );
    }

    return filtered.map((entry) => {
      const isExpanded = !!expandedDirs[entry.path];
      const isSelected = path === entry.path || path === toRelativePath(entry.path, rootPath);

      if (entry.isDir) {
        return (
          <div key={entry.path}>
            <div
              style={{ paddingLeft: `${depth * 14 + 4}px` }}
              className={`flex items-center justify-between rounded px-1.5 py-1 text-xs transition cursor-pointer hover:bg-cyber-neon/10 ${
                isSelected ? 'bg-cyber-neon/15 text-cyber-neon font-semibold' : 'text-slate-300'
              }`}
            >
              <div
                className="flex items-center gap-1.5 min-w-0 flex-1"
                onClick={() => toggleDirectory(entry.path)}
              >
                <span className="text-[10px] text-slate-400 w-3 text-center select-none font-mono">
                  {isExpanded ? '▼' : '▶'}
                </span>
                <span className="text-xs select-none">{isExpanded ? '📂' : '📁'}</span>
                <span className="truncate font-mono text-[11px]">{entry.name}</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectEntry(entry);
                }}
                className="rounded border border-cyber-line/50 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 hover:border-cyber-neon hover:text-cyber-neon transition"
              >
                {tr("Pick")}
              </button>
            </div>
            {isExpanded && (
              <div className="border-l border-cyber-line/20 ml-2">
                {renderDirectoryTree(entry.path, depth + 1)}
              </div>
            )}
          </div>
        );
      }

      const isCfg = isConfigFile(entry.name);
      return (
        <div
          key={entry.path}
          style={{ paddingLeft: `${depth * 14 + 18}px` }}
          onClick={() => handleSelectEntry(entry)}
          className={`flex items-center justify-between rounded px-1.5 py-1 text-xs transition cursor-pointer hover:bg-cyber-electric/15 ${
            isSelected
              ? 'bg-cyber-electric/20 text-cyber-electric font-semibold border border-cyber-electric/40'
              : 'text-slate-300'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span className="text-xs select-none">{isCfg ? '⚙️' : '📄'}</span>
            <span className="truncate font-mono text-[11px]">{entry.name}</span>
          </div>
          {isCfg && (
            <span className="text-[8px] uppercase tracking-wider px-1 py-0.2 rounded bg-cyber-electric/15 text-cyber-electric font-mono shrink-0">
              config
            </span>
          )}
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-cyber-neon/50 bg-cyber-panel p-5 shadow-2xl backdrop-blur-md select-none scrollbar-thin">
        <div className="mb-4 flex items-center justify-between border-b border-cyber-line/40 pb-3">
          <h3 className="font-display text-sm uppercase tracking-[0.2em] text-cyber-neon font-bold">
            {initialConfig ? tr("✏️ Edit Quick Config File") : tr("⚡ Add Quick Config File")}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-cyber-line px-2 py-1 text-xs text-slate-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-mono">{tr("Config Name / Title *")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={tr("e.g. Nginx Server Config, Docker Compose")}
              className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-xs text-slate-100 font-mono outline-none focus:border-cyber-neon transition"
              autoFocus
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[10px] uppercase tracking-wider text-slate-400 font-mono">{tr("File Path (Relative or Absolute) *")}</label>
              <div className="flex items-center gap-1.5">
                {rootPath && (
                  <button
                    type="button"
                    onClick={() => setTreeOpen((prev) => !prev)}
                    className={`rounded border px-2 py-0.5 text-[10px] font-mono transition flex items-center gap-1 ${
                      treeOpen
                        ? 'border-cyber-neon bg-cyber-neon/15 text-cyber-neon font-bold'
                        : 'border-cyber-line bg-cyber-base/40 text-slate-300 hover:border-cyber-neon/40 hover:text-white'
                    }`}
                  >
                    <span>📁</span>
                    <span>{treeOpen ? tr("Hide Folder Tree") : tr("UI Folder Tree")}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handlePickNativeFile}
                  title={tr("Pick file from system")}
                  className="rounded border border-cyber-line bg-cyber-base/40 px-2 py-0.5 text-[10px] font-mono text-slate-300 hover:border-cyber-electric hover:text-cyber-electric transition flex items-center gap-1"
                >
                  <span>📄</span>
                  <span>{tr("Pick File")}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePickNativeFolder}
                  title={tr("Pick folder from system")}
                  className="rounded border border-cyber-line bg-cyber-base/40 px-2 py-0.5 text-[10px] font-mono text-slate-300 hover:border-cyber-electric hover:text-cyber-electric transition flex items-center gap-1"
                >
                  <span>📂</span>
                  <span>{tr("Pick Folder")}</span>
                </button>
              </div>
            </div>

            <input
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder={tr("e.g. docker-compose.yml, config/app.yaml, .env")}
              className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-xs text-slate-100 font-mono outline-none focus:border-cyber-electric transition"
            />

            {/* In-modal Workspace Directory Tree */}
            {treeOpen && rootPath && (
              <div className="mt-2.5 rounded-lg border border-cyber-neon/30 bg-[#060a14] p-3 space-y-2 shadow-inner">
                <div className="flex items-center justify-between border-b border-cyber-line/30 pb-2">
                  <div className="flex items-center gap-1.5 truncate max-w-[320px] text-slate-300 font-mono text-[10px]" title={rootPath}>
                    <span className="text-cyber-neon text-xs">📁</span>
                    <span className="truncate">{rootPath}</span>
                  </div>
                  <span className="text-[10px] text-cyber-neon font-mono font-semibold">{tr("Click item to pick path")}</span>
                </div>

                {/* Filter in tree */}
                <div className="relative">
                  <input
                    type="text"
                    value={treeFilter}
                    onChange={(e) => setTreeFilter(e.target.value)}
                    placeholder={tr("Filter folder files...")}
                    className="w-full rounded border border-cyber-line/50 bg-cyber-base/80 px-2.5 py-1 text-[11px] text-slate-200 placeholder-slate-500 font-mono outline-none focus:border-cyber-neon transition"
                  />
                  {treeFilter && (
                    <button
                      type="button"
                      onClick={() => setTreeFilter('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1 scrollbar-thin">
                  {renderDirectoryTree(rootPath)}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-mono">{tr("Group / Category (e.g. Docker, Environment, Database, General)")}</label>
            <input
              type="text"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              placeholder={tr("e.g. Docker, Environment, Database")}
              className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-xs text-slate-100 font-mono outline-none focus:border-cyber-neon transition"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1 font-mono">{tr("Description (Mô tả chi tiết mục đích cấu hình)")}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={tr("e.g. Cấu hình cổng server, môi trường và chuỗi kết nối database")}
              rows={3}
              className="w-full rounded border border-cyber-line bg-cyber-base px-3 py-2 text-xs text-slate-100 font-mono outline-none focus:border-cyber-neon transition resize-none"
            />
          </div>

          {error && (
            <div className="rounded border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-300 font-mono">
              {trFeedback(error ?? '')}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-cyber-line px-4 py-1.5 text-xs text-slate-400 hover:text-slate-200 uppercase font-mono transition"
            >{tr("Cancel")}</button>
            <button
              type="submit"
              className="rounded border border-cyber-neon/50 bg-cyber-neon/15 px-4 py-1.5 text-xs font-bold text-cyber-neon hover:bg-cyber-neon/25 uppercase font-mono transition shadow-neon-sm-faint"
            >{tr("Save Config")}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
