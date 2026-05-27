import { useCallback, useEffect, useMemo, useState } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import type { CliDefinition } from '../types';

interface CliStartModalProps {
    isOpen: boolean;
    cli: CliDefinition | null;
    accountProfiles: string[];
    activeProfile?: string | null;
    isLoadingAccounts: boolean;
    onClose: () => void;
    onConfirm: (cliName: string, directory: string, tag: string, profileName: string | null) => void;
}

export function CliStartModal({
    isOpen,
    cli,
    accountProfiles,
    activeProfile,
    isLoadingAccounts,
    onClose,
    onConfirm,
}: CliStartModalProps) {
    const [selectedProfile, setSelectedProfile] = useState<string>('__active__');

    useEffect(() => {
        if (!isOpen || !cli) return;
        setSelectedProfile('__active__');
    }, [cli, isOpen, activeProfile]);

    const profileOptions = useMemo(() => {
        const options: { value: string; label: string }[] = [];
        if (activeProfile) {
            options.push({ value: '__active__', label: `Keep current (${activeProfile})` });
        } else {
            options.push({ value: '__active__', label: 'No active account' });
        }
        accountProfiles.forEach((profile) => {
            options.push({ value: profile, label: profile });
        });
        return options;
    }, [accountProfiles, activeProfile]);

    const resolvedProfile = selectedProfile === '__active__' || !selectedProfile
        ? null
        : selectedProfile;

    const handlePickNewFolder = useCallback(async () => {
        if (!cli) return;
        try {
            const picked = await open({
                directory: true,
                multiple: false,
                title: `Select Working Directory for ${cli.name}`,
            });

            if (typeof picked === 'string') {
                onConfirm(cli.name, picked, '', resolvedProfile);
            }
        } catch (error) {
            console.error('Failed to pick folder:', error);
        }
    }, [cli, onConfirm, resolvedProfile]);

    if (!isOpen || !cli) return null;

    const savedDirs = cli.savedDirectories ?? [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-cyber-base/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-cyber-neon/30 bg-cyber-panel p-6 shadow-2xl shadow-cyber-neon/10">
                <div className="mb-4">
                    <h2 className="font-display text-lg uppercase tracking-widest text-cyber-neon">
                        Start {cli.name}
                    </h2>
                    <p className="text-sm text-slate-400">Select a working directory to begin.</p>
                </div>

                <div className="space-y-3">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-slate-500">
                            Account Profile
                        </label>
                        <select
                            value={selectedProfile || '__active__'}
                            onChange={(event) => setSelectedProfile(event.target.value)}
                            disabled={isLoadingAccounts}
                            className="w-full rounded border border-cyber-line/60 bg-cyber-base/40 px-3 py-2 text-xs text-slate-200 outline-none transition focus:border-cyber-neon disabled:cursor-not-allowed disabled:text-slate-500"
                        >
                            {profileOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {!isLoadingAccounts && accountProfiles.length === 0 ? (
                            <p className="text-[11px] text-slate-500">No saved accounts for this CLI.</p>
                        ) : null}
                    </div>

                    {savedDirs.length > 0 && (
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-widest text-slate-500">
                                Saved Directories
                            </label>
                            <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
                                {savedDirs.map((dir) => (
                                    <button
                                        key={`${dir.tag}-${dir.path}`}
                                        onClick={() => onConfirm(cli.name, dir.path, dir.tag, resolvedProfile)}
                                        className="group w-full rounded border border-cyber-line bg-cyber-base/50 p-3 text-left transition hover:border-cyber-electric/50 hover:bg-cyber-electric/5"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-slate-200 group-hover:text-cyber-electric">
                                                #{dir.tag}
                                            </span>
                                        </div>
                                        <p className="mt-1 truncate text-xs text-slate-500">{dir.path}</p>
                                    </button>
                                ))}
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
