import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { confirm, open } from '@tauri-apps/plugin-dialog';
import {
    deleteQuickapp,
    launchQuickapp,
    listQuickapps,
    reextractQuickappIcons,
    upsertQuickapp,
} from '../lib/tauri';
import type { QuickApp } from '../types';

// ─── Icons ──────────────────────────────────────────────────────────────────

function PlusIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    );
}

function RefreshIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
    );
}

function EditIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487 1.687 20.662a1.875 1.875 0 0 0 2.652 2.652L19.514 7.14a1.875 1.875 0 0 0-2.652-2.652Z" />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
    );
}

function SearchIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
    );
}

function GroupIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
    );
}

// ─── Tile ────────────────────────────────────────────────────────────────────

interface QuickAppTileProps {
    app: QuickApp;
    selected: boolean;
    onLaunch: (app: QuickApp) => void;
    onEdit: (app: QuickApp) => void;
    onDelete: (app: QuickApp) => void;
    size?: 'sm' | 'md' | 'lg';
}

function QuickAppTile({ app, selected, onLaunch, onEdit, onDelete, size = 'md' }: QuickAppTileProps) {
    const [hovered, setHovered] = useState(false);
    const onClick = useCallback(() => onLaunch(app), [app, onLaunch]);
    const onEditClick = useCallback((e: React.MouseEvent) => { e.stopPropagation(); onEdit(app); }, [app, onEdit]);
    const onDeleteClick = useCallback((e: React.MouseEvent) => { e.stopPropagation(); void onDelete(app); }, [app, onDelete]);

    const iconSizeClass = size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-16 h-16' : 'w-12 h-12';
    const imgSizeClass = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';
    const containerClass = size === 'sm' ? 'p-2 gap-1.5' : size === 'lg' ? 'p-4 gap-3' : 'p-3 gap-2';
    const textClass = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-[13px]' : 'text-[11px]';

    return (
        <button
            type="button"
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            title={`${app.command}${app.args?.length ? ' ' + app.args.join(' ') : ''}\nSingle-click to launch\nHover for options`}
            className={`group relative flex flex-col items-center ${containerClass} rounded-xl border transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyber-accent ${
                selected
                    ? 'bg-cyber-accent/20 border-cyber-accent shadow-lg shadow-cyber-accent/20 scale-105'
                    : 'bg-cyber-surface/30 border-cyber-line/30 hover:bg-cyber-accent/10 hover:border-cyber-accent/40 hover:scale-105 hover:shadow-md hover:shadow-cyber-accent/10'
            }`}
        >
            {/* Icon area */}
            <div className={`${iconSizeClass} rounded-lg bg-cyber-base/60 border border-cyber-line/40 flex items-center justify-center overflow-hidden shrink-0 transition-all duration-200 ${selected ? 'border-cyber-accent/60' : 'group-hover:border-cyber-accent/30'}`}>
                {app.iconDataUrl && !app.iconMissing ? (
                    <img
                        src={app.iconDataUrl}
                        alt={app.name}
                        className={`${imgSizeClass} object-contain`}
                        draggable={false}
                    />
                ) : (
                    <div className={`${imgSizeClass} flex items-center justify-center`}>
                        <span className={`text-cyber-muted font-bold uppercase tracking-wider text-center px-1 ${size === 'sm' ? 'text-[8px]' : 'text-[10px]'}`}>
                            {app.name.slice(0, 2).toUpperCase()}
                        </span>
                    </div>
                )}
            </div>

            {/* Label */}
            <div className={`w-full ${textClass} text-cyber-text text-center line-clamp-2 break-words leading-tight font-medium`}>
                {app.name}
            </div>

            {/* Hover action buttons */}
            {hovered && (
                <div className="absolute top-1 right-1 flex gap-0.5 z-10">
                    <button
                        type="button"
                        onClick={onEditClick}
                        className="p-0.5 rounded bg-cyber-base/80 border border-cyber-line/60 text-cyber-muted hover:text-cyber-accent hover:border-cyber-accent/50 transition-colors"
                        title="Edit"
                    >
                        <EditIcon />
                    </button>
                    <button
                        type="button"
                        onClick={onDeleteClick}
                        className="p-0.5 rounded bg-cyber-base/80 border border-cyber-line/60 text-cyber-muted hover:text-cyber-warn hover:border-cyber-warn/50 transition-colors"
                        title="Delete"
                    >
                        <TrashIcon />
                    </button>
                </div>
            )}

            {/* Selected glow dot */}
            {selected && (
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyber-accent" />
            )}
        </button>
    );
}

// ─── Form ────────────────────────────────────────────────────────────────────

interface QuickAppFormProps {
    initial: QuickApp | null;
    existingGroups: string[];
    onCancel: () => void;
    onSubmit: (app: QuickApp) => Promise<void>;
}

function QuickAppForm({ initial, existingGroups, onCancel, onSubmit }: QuickAppFormProps) {
    const [name, setName] = useState(initial?.name ?? '');
    const [command, setCommand] = useState(initial?.command ?? '');
    const [argsText, setArgsText] = useState((initial?.args ?? []).join(' '));
    const [workingDir, setWorkingDir] = useState(initial?.workingDir ?? '');
    const [iconPath, setIconPath] = useState(initial?.iconPath ?? '');
    const [order, setOrder] = useState(initial?.order ?? 0);
    const [group, setGroup] = useState(initial?.group ?? '');
    const [customGroup, setCustomGroup] = useState('');
    const [useCustomGroup, setUseCustomGroup] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAdvanced, setShowAdvanced] = useState(false);

    useEffect(() => {
        if (initial) {
            setName(initial.name);
            setCommand(initial.command);
            setArgsText((initial.args ?? []).join(' '));
            setWorkingDir(initial.workingDir ?? '');
            setIconPath(initial.iconPath ?? '');
            setOrder(initial.order);
            setGroup(initial.group ?? '');
        }
    }, [initial]);

    const handlePickCommand = useCallback(async () => {
        try {
            const picked = await open({
                directory: false,
                multiple: false,
                title: 'Select executable',
                filters: [
                    { name: 'Executables', extensions: ['exe', 'bat', 'cmd', 'lnk', 'ps1'] },
                    { name: 'All files', extensions: ['*'] },
                ],
            });
            if (typeof picked === 'string') {
                setCommand(picked);
                // Auto-fill name from filename if not set
                if (!name.trim()) {
                    const filename = picked.split(/[/\\]/).pop() ?? '';
                    const basename = filename.replace(/\.(exe|bat|cmd|lnk|ps1)$/i, '');
                    setName(basename);
                }
            }
        } catch (err) {
            console.error('Pick exe failed:', err);
        }
    }, [name]);

    const handlePickIcon = useCallback(async () => {
        try {
            const picked = await open({
                directory: false,
                multiple: false,
                title: 'Select icon file (optional)',
                filters: [{ name: 'Icons', extensions: ['png', 'ico', 'jpg', 'jpeg'] }],
            });
            if (typeof picked === 'string') setIconPath(picked);
        } catch (err) {
            console.error('Pick icon failed:', err);
        }
    }, []);

    const handlePickWorkingDir = useCallback(async () => {
        try {
            const picked = await open({
                directory: true,
                multiple: false,
                title: 'Select working directory',
            });
            if (typeof picked === 'string') setWorkingDir(picked);
        } catch (err) {
            console.error('Pick working dir failed:', err);
        }
    }, []);

    const effectiveGroup = useCustomGroup ? customGroup : group;

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setError(null);
            if (!name.trim()) { setError('Name is required'); return; }
            if (!command.trim()) { setError('Command is required'); return; }
            const args = argsText.split(/\s+/).map((s) => s.trim()).filter((s) => s.length > 0);
            const id = initial?.id ?? generateId(name);
            const payload: QuickApp = {
                id,
                name: name.trim(),
                command: command.trim(),
                args,
                workingDir: workingDir.trim() || undefined,
                iconPath: iconPath.trim() || undefined,
                order,
                iconMissing: initial?.iconMissing ?? true,
                iconDataUrl: initial?.iconDataUrl,
                group: effectiveGroup.trim() || undefined,
            };
            setSubmitting(true);
            try {
                await onSubmit(payload);
            } catch (err) {
                setError(String(err));
            } finally {
                setSubmitting(false);
            }
        },
        [initial, name, command, argsText, workingDir, iconPath, order, effectiveGroup, onSubmit],
    );

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-cyber-line/40 bg-cyber-base/30 shrink-0">
                <div>
                    <h3 className="text-sm font-bold text-cyber-accent uppercase tracking-wider">
                        {initial ? '✎ Edit App' : '+ New App'}
                    </h3>
                    <p className="text-[10px] text-cyber-muted mt-0.5">
                        {initial ? `Editing: ${initial.name}` : 'Fill in the details below'}
                    </p>
                </div>
                {initial?.iconDataUrl && !initial.iconMissing && (
                    <img src={initial.iconDataUrl} alt={initial.name} className="w-10 h-10 object-contain rounded-lg border border-cyber-line/40 bg-cyber-base/60" draggable={false} />
                )}
            </div>

            {/* ── Scrollable form body ── */}
            <div className="flex-1 overflow-y-auto">
                <form id="quickapp-form" onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 pb-4">
                    {/* Name */}
                    <label className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-cyber-muted">Name <span className="text-cyber-warn">*</span></span>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Google Chrome"
                            className="px-3 py-2 rounded-lg bg-cyber-base/60 border border-cyber-line/60 text-cyber-text text-[12px] focus:outline-none focus:ring-2 focus:ring-cyber-accent/50 focus:border-cyber-accent/80 transition-all placeholder:text-cyber-muted/50"
                        />
                    </label>

                    {/* Command */}
                    <label className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-cyber-muted">Command / Path <span className="text-cyber-warn">*</span></span>
                        <div className="flex gap-2">
                            <input
                                value={command}
                                onChange={(e) => setCommand(e.target.value)}
                                placeholder="C:\Program Files\Google\Chrome\chrome.exe"
                                className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-cyber-base/60 border border-cyber-line/60 text-cyber-text text-[11px] font-mono focus:outline-none focus:ring-2 focus:ring-cyber-accent/50 focus:border-cyber-accent/80 transition-all placeholder:text-cyber-muted/50"
                            />
                            <button
                                type="button"
                                onClick={handlePickCommand}
                                className="px-3 py-2 rounded-lg bg-cyber-accent/20 hover:bg-cyber-accent/40 text-cyber-accent text-[11px] border border-cyber-accent/40 font-semibold transition-all hover:border-cyber-accent/70 shrink-0"
                            >
                                Browse
                            </button>
                        </div>
                        <p className="text-[10px] text-cyber-muted/70 leading-relaxed">
                            Supports .exe, .bat, .cmd, .lnk (shortcuts), .ps1
                        </p>
                    </label>

                    {/* Group */}
                    <label className="flex flex-col gap-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-cyber-muted">Group (optional)</span>
                        {!useCustomGroup ? (
                            <div className="flex gap-2">
                                <select
                                    value={group}
                                    onChange={(e) => setGroup(e.target.value)}
                                    className="flex-1 px-3 py-2 rounded-lg bg-cyber-base/60 border border-cyber-line/60 text-cyber-text text-[12px] focus:outline-none focus:ring-2 focus:ring-cyber-accent/50 focus:border-cyber-accent/80 transition-all"
                                >
                                    <option value="">— No group —</option>
                                    {existingGroups.map((g) => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setUseCustomGroup(true)}
                                    className="px-3 py-2 rounded-lg bg-cyber-surface/40 hover:bg-cyber-surface/80 text-cyber-muted text-[10px] border border-cyber-line/50 transition-all shrink-0"
                                >
                                    + New
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    value={customGroup}
                                    onChange={(e) => setCustomGroup(e.target.value)}
                                    placeholder="e.g. Development, Social, Utilities"
                                    autoFocus
                                    className="flex-1 px-3 py-2 rounded-lg bg-cyber-base/60 border border-cyber-accent/50 text-cyber-text text-[12px] focus:outline-none focus:ring-2 focus:ring-cyber-accent/50 transition-all placeholder:text-cyber-muted/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => { setUseCustomGroup(false); setCustomGroup(''); }}
                                    className="px-3 py-2 rounded-lg bg-cyber-surface/40 hover:bg-cyber-surface/80 text-cyber-muted text-[10px] border border-cyber-line/50 transition-all shrink-0"
                                >
                                    ← Back
                                </button>
                            </div>
                        )}
                    </label>

                    {/* Advanced toggle */}
                    <button
                        type="button"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center gap-2 text-[11px] text-cyber-muted hover:text-cyber-text transition-colors"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-3.5 w-3.5 transition-transform ${showAdvanced ? 'rotate-90' : ''}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                        Advanced options
                    </button>

                    {showAdvanced && (
                        <div className="flex flex-col gap-4 pl-4 border-l-2 border-cyber-line/40">
                            {/* Arguments */}
                            <label className="flex flex-col gap-1.5">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-cyber-muted">Arguments</span>
                                <input
                                    value={argsText}
                                    onChange={(e) => setArgsText(e.target.value)}
                                    placeholder="--new-window --profile-directory=Default"
                                    className="px-3 py-2 rounded-lg bg-cyber-base/60 border border-cyber-line/60 text-cyber-text text-[11px] font-mono focus:outline-none focus:ring-2 focus:ring-cyber-accent/50 focus:border-cyber-accent/80 transition-all placeholder:text-cyber-muted/50"
                                />
                                <p className="text-[10px] text-cyber-muted/70">Space-separated arguments</p>
                            </label>

                            {/* Working directory */}
                            <label className="flex flex-col gap-1.5">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-cyber-muted">Working Directory</span>
                                <div className="flex gap-2">
                                    <input
                                        value={workingDir}
                                        onChange={(e) => setWorkingDir(e.target.value)}
                                        placeholder="Leave blank to use default"
                                        className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-cyber-base/60 border border-cyber-line/60 text-cyber-text text-[11px] font-mono focus:outline-none focus:ring-2 focus:ring-cyber-accent/50 focus:border-cyber-accent/80 transition-all placeholder:text-cyber-muted/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={handlePickWorkingDir}
                                        className="px-3 py-2 rounded-lg bg-cyber-accent/20 hover:bg-cyber-accent/40 text-cyber-accent text-[11px] border border-cyber-accent/40 font-semibold transition-all hover:border-cyber-accent/70 shrink-0"
                                    >
                                        Browse
                                    </button>
                                </div>
                            </label>

                            {/* Custom icon */}
                            <label className="flex flex-col gap-1.5">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-cyber-muted">Custom Icon</span>
                                <div className="flex gap-2">
                                    <input
                                        value={iconPath}
                                        onChange={(e) => setIconPath(e.target.value)}
                                        placeholder="Auto-extracted from executable"
                                        className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-cyber-base/60 border border-cyber-line/60 text-cyber-text text-[11px] font-mono focus:outline-none focus:ring-2 focus:ring-cyber-accent/50 focus:border-cyber-accent/80 transition-all placeholder:text-cyber-muted/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={handlePickIcon}
                                        className="px-3 py-2 rounded-lg bg-cyber-accent/20 hover:bg-cyber-accent/40 text-cyber-accent text-[11px] border border-cyber-accent/40 font-semibold transition-all hover:border-cyber-accent/70 shrink-0"
                                    >
                                        Browse
                                    </button>
                                </div>
                            </label>

                            {/* Sort order */}
                            <label className="flex flex-col gap-1.5">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-cyber-muted">Sort Order</span>
                                <input
                                    type="number"
                                    value={order}
                                    onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
                                    className="w-24 px-3 py-2 rounded-lg bg-cyber-base/60 border border-cyber-line/60 text-cyber-text text-[12px] font-mono focus:outline-none focus:ring-2 focus:ring-cyber-accent/50 focus:border-cyber-accent/80 transition-all"
                                />
                            </label>
                        </div>
                    )}

                    {error && (
                        <div className="text-[11px] text-cyber-warn px-3 py-2 rounded-lg bg-cyber-warn/10 border border-cyber-warn/30">
                            ⚠ {error}
                        </div>
                    )}
                </form>
            </div>

            {/* ── Fixed footer — always visible ── */}
            <div className="shrink-0 flex items-center justify-between gap-3 px-5 py-4 border-t-2 border-cyber-line/60 bg-cyber-base">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 rounded-lg text-[12px] text-cyber-muted hover:text-cyber-text border border-cyber-line/60 hover:border-cyber-line transition-all"
                >
                    ✕ Cancel
                </button>
                <button
                    type="submit"
                    form="quickapp-form"
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-[13px] bg-cyber-accent text-cyber-base hover:bg-cyber-accent-hover disabled:opacity-50 font-bold transition-all shadow-lg shadow-cyber-accent/30"
                >
                    {submitting ? (
                        <>
                            <div className="w-3.5 h-3.5 border-2 border-cyber-base/40 border-t-cyber-base rounded-full animate-spin" />
                            Saving…
                        </>
                    ) : (
                        <>✓ {initial ? 'Save Changes' : 'Add App'}</>
                    )}
                </button>
            </div>
        </div>
    );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateId(name: string): string {
    const base = name
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 32) || 'app';
    const suffix = Math.random().toString(36).slice(2, 6);
    return `${base}-${suffix}`;
}

const UNGROUPED_LABEL = 'Uncategorized';

// ─── Main Panel ──────────────────────────────────────────────────────────────

export function QuickAppsPanel() {
    const [apps, setApps] = useState<QuickApp[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<QuickApp | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [lastLaunchedId, setLastLaunchedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeGroup, setActiveGroup] = useState<string | null>(null);
    const [tileSize, setTileSize] = useState<'sm' | 'md' | 'lg'>('md');
    const flashTimerRef = useRef<number | null>(null);

    const refresh = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const loaded = await listQuickapps();
            setApps(loaded);
        } catch (err) {
            setError(String(err));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { void refresh(); }, [refresh]);

    useEffect(() => {
        return () => {
            if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
        };
    }, []);

    const handleLaunch = useCallback(async (app: QuickApp) => {
        try {
            await launchQuickapp(app.id);
            setLastLaunchedId(app.id);
            if (flashTimerRef.current) window.clearTimeout(flashTimerRef.current);
            flashTimerRef.current = window.setTimeout(() => setLastLaunchedId(null), 800);
        } catch (err) {
            setError(`Failed to launch ${app.name}: ${String(err)}`);
        }
    }, []);

    const handleEdit = useCallback((app: QuickApp) => {
        setEditing(app);
        setShowForm(true);
    }, []);

    const handleDelete = useCallback(async (app: QuickApp) => {
        const yes = await confirm(`Remove "${app.name}" from Quick Apps?`, {
            title: 'Remove Quick App',
            kind: 'warning',
        });
        if (!yes) return;
        try {
            await deleteQuickapp(app.id);
            setEditing((current) => (current?.id === app.id ? null : current));
            await refresh();
        } catch (err) {
            setError(String(err));
        }
    }, [refresh]);

    const handleAdd = useCallback(() => {
        setEditing(null);
        setShowForm(true);
    }, []);

    const handleCancelForm = useCallback(() => {
        setShowForm(false);
        setEditing(null);
    }, []);

    const handleSubmit = useCallback(async (payload: QuickApp) => {
        await upsertQuickapp(payload);
        setShowForm(false);
        setEditing(null);
        await refresh();
    }, [refresh]);

    const handleReextract = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const reextracted = await reextractQuickappIcons();
            setApps(reextracted);
        } catch (err) {
            setError(String(err));
        } finally {
            setLoading(false);
        }
    }, []);

    const sortedApps = useMemo(
        () => [...apps].sort((a, b) => (a.order - b.order) || a.name.localeCompare(b.name)),
        [apps],
    );

    // Build groups
    const groups = useMemo(() => {
        const map = new Map<string, QuickApp[]>();
        for (const app of sortedApps) {
            const g = app.group?.trim() || UNGROUPED_LABEL;
            if (!map.has(g)) map.set(g, []);
            map.get(g)!.push(app);
        }
        // Sort groups: named groups first (alphabetically), then ungrouped last
        const entries = Array.from(map.entries()).sort(([a], [b]) => {
            if (a === UNGROUPED_LABEL && b !== UNGROUPED_LABEL) return 1;
            if (b === UNGROUPED_LABEL && a !== UNGROUPED_LABEL) return -1;
            return a.localeCompare(b);
        });
        return entries;
    }, [sortedApps]);

    const existingGroups = useMemo(
        () => Array.from(new Set(apps.map((a) => a.group).filter(Boolean) as string[])).sort(),
        [apps],
    );

    // Filtered apps
    const filteredGroups = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return groups
            .map(([groupName, groupApps]) => {
                const filtered = groupApps.filter((app) => {
                    const matchesGroup = !activeGroup || activeGroup === groupName;
                    const matchesSearch = !q || app.name.toLowerCase().includes(q) || app.command.toLowerCase().includes(q);
                    return matchesGroup && matchesSearch;
                });
                return [groupName, filtered] as [string, QuickApp[]];
            })
            .filter(([, groupApps]) => groupApps.length > 0);
    }, [groups, activeGroup, searchQuery]);

    const totalVisible = filteredGroups.reduce((sum, [, arr]) => sum + arr.length, 0);

    // If form is open, show form panel
    if (showForm) {
        return (
            <div className="flex h-full flex-col overflow-hidden bg-cyber-base">
                <QuickAppForm
                    initial={editing}
                    existingGroups={existingGroups}
                    onCancel={handleCancelForm}
                    onSubmit={handleSubmit}
                />
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col overflow-hidden bg-cyber-base">
            {/* ── Header ── */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-cyber-line px-6 py-4 bg-gradient-to-r from-cyber-base/80 to-cyber-surface/30">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyber-accent/20 border border-cyber-accent/40">
                        <GroupIcon />
                    </div>
                    <div className="min-w-0">
                        <h2 className="font-display text-sm uppercase tracking-[0.2em] text-cyber-electric font-bold">Quick Apps</h2>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                            {apps.length} {apps.length === 1 ? 'app' : 'apps'}
                            {activeGroup ? ` · ${activeGroup}` : ''}
                            {searchQuery ? ` · "${searchQuery}"` : ''}
                        </p>
                    </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                    {/* Tile size toggle */}
                    <div className="flex gap-0.5 p-0.5 rounded-lg bg-cyber-surface/40 border border-cyber-line/40">
                        {(['sm', 'md', 'lg'] as const).map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setTileSize(s)}
                                className={`px-2 py-1 rounded text-[10px] font-mono transition-all ${
                                    tileSize === s
                                        ? 'bg-cyber-accent/30 text-cyber-accent border border-cyber-accent/50'
                                        : 'text-cyber-muted hover:text-cyber-text'
                                }`}
                            >
                                {s.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => void handleReextract()}
                        disabled={loading}
                        title="Re-extract all icons"
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] rounded-lg text-cyber-muted hover:text-cyber-text border border-cyber-line/60 hover:border-cyber-accent/50 disabled:opacity-50 transition-all bg-cyber-surface/30"
                    >
                        <RefreshIcon />
                        Icons
                    </button>
                    <button
                        type="button"
                        onClick={handleAdd}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] rounded-lg bg-cyber-accent text-cyber-base hover:bg-cyber-accent-hover font-bold transition-all shadow-md shadow-cyber-accent/20"
                    >
                        <PlusIcon />
                        Add App
                    </button>
                </div>
            </div>

            {/* ── Search + Group Filter ── */}
            <div className="shrink-0 flex items-center gap-3 px-6 py-3 border-b border-cyber-line/50 bg-cyber-base/30">
                {/* Search */}
                <div className="relative flex-1 max-w-xs">
                    <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none text-cyber-muted">
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        placeholder="Search apps…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-cyber-surface/40 border border-cyber-line/60 text-cyber-text text-[12px] focus:outline-none focus:ring-2 focus:ring-cyber-accent/40 focus:border-cyber-accent/60 transition-all placeholder:text-cyber-muted/60"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-2 flex items-center text-cyber-muted hover:text-cyber-text text-xs"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Group filter chips */}
                {groups.length > 1 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                        <button
                            type="button"
                            onClick={() => setActiveGroup(null)}
                            className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${
                                !activeGroup
                                    ? 'bg-cyber-accent/20 border-cyber-accent/60 text-cyber-accent'
                                    : 'border-cyber-line/40 text-cyber-muted hover:border-cyber-accent/30 hover:text-cyber-text'
                            }`}
                        >
                            All
                        </button>
                        {groups.map(([groupName, groupApps]) => (
                            <button
                                key={groupName}
                                type="button"
                                onClick={() => setActiveGroup(activeGroup === groupName ? null : groupName)}
                                className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${
                                    activeGroup === groupName
                                        ? 'bg-cyber-accent/20 border-cyber-accent/60 text-cyber-accent'
                                        : 'border-cyber-line/40 text-cyber-muted hover:border-cyber-accent/30 hover:text-cyber-text'
                                }`}
                            >
                                {groupName}
                                <span className={`text-[9px] px-1 py-0.5 rounded-full ${
                                    activeGroup === groupName ? 'bg-cyber-accent/30' : 'bg-cyber-surface/60'
                                }`}>
                                    {groupApps.length}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Error ── */}
            {error && (
                <div className="shrink-0 mx-6 mt-3 px-4 py-2 text-[11px] text-cyber-warn bg-cyber-warn/10 border border-cyber-warn/30 rounded-lg">
                    ⚠ {error}
                </div>
            )}

            {/* ── Content ── */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
                {loading && apps.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center gap-3 text-cyber-muted">
                            <div className="w-8 h-8 border-2 border-cyber-accent/40 border-t-cyber-accent rounded-full animate-spin" />
                            <span className="text-[12px]">Loading apps…</span>
                        </div>
                    </div>
                ) : apps.length === 0 ? (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center gap-4 h-full text-cyber-muted">
                        <div className="w-16 h-16 rounded-2xl bg-cyber-surface/40 border border-cyber-line/40 flex items-center justify-center text-3xl">
                            📂
                        </div>
                        <div className="text-center">
                            <p className="text-[14px] font-semibold text-cyber-text">No quick apps yet</p>
                            <p className="text-[12px] text-cyber-muted mt-1">Add your favorite apps for quick access</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleAdd}
                            className="flex items-center gap-2 px-4 py-2 text-[12px] rounded-lg bg-cyber-accent text-cyber-base hover:bg-cyber-accent-hover font-bold transition-all shadow-md shadow-cyber-accent/20"
                        >
                            <PlusIcon />
                            Add your first app
                        </button>
                    </div>
                ) : totalVisible === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 h-full text-cyber-muted">
                        <span className="text-2xl">🔍</span>
                        <p className="text-[12px]">No apps match your search</p>
                        <button type="button" onClick={() => { setSearchQuery(''); setActiveGroup(null); }} className="text-[11px] text-cyber-accent hover:underline">
                            Clear filters
                        </button>
                    </div>
                ) : (
                    /* Grouped grid */
                    <div className="flex flex-col gap-8">
                        {filteredGroups.map(([groupName, groupApps], groupIdx) => (
                            <section key={groupName}>
                                {/* Group header */}
                                {filteredGroups.length > 1 && (
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-px flex-1 bg-gradient-to-r from-cyber-line/60 to-transparent" />
                                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-surface/40 border border-cyber-line/40">
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-cyber-muted">
                                                {groupName}
                                            </span>
                                            <span className="text-[10px] text-cyber-muted/60 bg-cyber-base/60 px-1.5 py-0.5 rounded-full">
                                                {groupApps.length}
                                            </span>
                                        </div>
                                        <div className="h-px flex-1 bg-gradient-to-l from-cyber-line/60 to-transparent" />
                                    </div>
                                )}
                                {/* Grid */}
                                <div
                                    className="grid gap-3"
                                    style={{
                                        gridTemplateColumns: tileSize === 'sm'
                                            ? 'repeat(auto-fill, minmax(4.5rem, 1fr))'
                                            : tileSize === 'lg'
                                            ? 'repeat(auto-fill, minmax(7rem, 1fr))'
                                            : 'repeat(auto-fill, minmax(5.5rem, 1fr))',
                                    }}
                                >
                                    {groupApps.map((app) => (
                                        <QuickAppTile
                                            key={app.id}
                                            app={app}
                                            selected={lastLaunchedId === app.id}
                                            onLaunch={handleLaunch}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                            size={tileSize}
                                        />
                                    ))}
                                    {/* Add tile — shown at end of last group only */}
                                    {groupIdx === filteredGroups.length - 1 && (
                                        <button
                                            type="button"
                                            onClick={handleAdd}
                                            title="Add new quick app"
                                            className="group flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-dashed border-cyber-line/30 hover:border-cyber-accent/50 hover:bg-cyber-accent/5 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyber-accent"
                                        >
                                            <div className={`${
                                                tileSize === 'sm' ? 'w-10 h-10' : tileSize === 'lg' ? 'w-16 h-16' : 'w-12 h-12'
                                            } rounded-lg bg-cyber-surface/20 flex items-center justify-center shrink-0 group-hover:bg-cyber-accent/10 transition-colors`}>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`${
                                                    tileSize === 'sm' ? 'h-4 w-4' : tileSize === 'lg' ? 'h-7 w-7' : 'h-5 w-5'
                                                } text-cyber-muted/40 group-hover:text-cyber-accent transition-colors`}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                            </div>
                                            <div className={`${
                                                tileSize === 'sm' ? 'text-[9px]' : tileSize === 'lg' ? 'text-[12px]' : 'text-[10px]'
                                            } text-cyber-muted/40 group-hover:text-cyber-accent transition-colors font-medium`}>
                                                Add
                                            </div>
                                        </button>
                                    )}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}