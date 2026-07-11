import { useCallback } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import type { CliDefinition } from '../types';

interface CliStartModalProps {
    isOpen: boolean;
    cli: CliDefinition | null;
    recentFolders: string[];
    onClose: () => void;
    onConfirm: (cliName: string, directory: string, tag: string, profileName: string | null) => void;
}

export function CliStartModal({
    isOpen,
    cli,
    recentFolders,
    onClose,
    onConfirm,
}: CliStartModalProps) {

    const handlePickNewFolder = useCallback(async () => {
        if (!cli) return;
        try {
            const picked = await open({
                directory: true,
                multiple: false,
                title: `Select Working Directory for ${cli.name}`,
            });

            if (typeof picked === 'string') {
                onConfirm(cli.name, picked, '', null);
            }
        } catch (error) {
            console.error('Failed to pick folder:', error);
        }
    }, [cli, onConfirm]);

    if (!isOpen || !cli) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-cyber-base/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-cyber-neon/30 bg-cyber-panel p-6 shadow-2xl shadow-cyber-neon/10 select-none">
                <div className="mb-4">
                    <h2 className="font-display text-lg uppercase tracking-widest text-cyber-neon">
                        Start {cli.name}
                    </h2>
                    <p className="text-xs text-slate-400">Select a working directory to begin.</p>
                </div>

                <div className="space-y-3">
                    {recentFolders.length > 0 && (
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold font-display">
                                🕒 Recent Thư Mục Làm Việc
                            </label>
                            <div className="max-h-60 space-y-2 overflow-y-auto pr-1 scrollbar-thin">
                                {recentFolders.map((dirPath) => {
                                    const folderName = dirPath.split(/[/\\]/).pop() || dirPath;
                                    return (
                                        <button
                                            key={dirPath}
                                            onClick={() => onConfirm(cli.name, dirPath, '', null)}
                                            className="group w-full rounded border border-cyber-line bg-[#0a0f1f]/60 p-3 text-left transition hover:border-cyber-electric/60 hover:bg-cyber-electric/5"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-slate-200 group-hover:text-cyber-electric font-mono text-xs">
                                                    📁 {folderName}
                                                </span>
                                            </div>
                                            <p className="mt-1 truncate text-[10px] text-slate-500 font-mono" title={dirPath}>{dirPath}</p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            onClick={handlePickNewFolder}
                            className="flex w-full items-center justify-center gap-2 rounded border border-dashed border-cyber-neon/50 bg-cyber-neon/5 py-4 text-sm font-semibold uppercase tracking-widest text-cyber-neon transition hover:border-cyber-neon hover:bg-cyber-neon/10"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Choose New Folder
                        </button>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-400 transition hover:text-slate-100"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
