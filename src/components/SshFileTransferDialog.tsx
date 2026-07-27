import { useState } from 'react';
import { downloadSshFile, uploadSshFile } from '../lib/tauri';
import { save } from '@tauri-apps/plugin-dialog';
import type { SshConnection } from '../types';

interface SshFileTransferDialogProps {
  mode: 'upload' | 'download';
  connection: SshConnection;
  files?: { name: string; path: string; size?: number }[];
  remotePath?: string;
  defaultRemoteDir?: string;
  onClose: () => void;
  onNotify?: (msg: string, type: 'success' | 'error') => void;
}

export function SshFileTransferDialog({
  mode,
  connection,
  files,
  remotePath,
  defaultRemoteDir,
  onClose,
  onNotify,
}: SshFileTransferDialogProps) {
  const [status, setStatus] = useState<'idle' | 'transferring' | 'done' | 'error'>('idle');
  const [targetDir, setTargetDir] = useState(defaultRemoteDir || '~/');
  const [errorMsg, setErrorMsg] = useState('');

  const handleTransfer = async () => {
    setStatus('transferring');
    try {
      if (mode === 'download' && remotePath) {
        const fileName = remotePath.split('/').pop() || 'download';
        const localDest = await save({ defaultPath: fileName });
        if (!localDest) {
          setStatus('idle');
          return;
        }
        await downloadSshFile(connection, remotePath, localDest);
        onNotify?.(`Downloaded ${fileName}`, 'success');
      } else if (mode === 'upload' && files) {
        for (const file of files) {
          const remoteTarget = targetDir.endsWith('/')
            ? `${targetDir}${file.name}`
            : `${targetDir}/${file.name}`;
          await uploadSshFile(connection, file.path, remoteTarget);
        }
        onNotify?.(`Uploaded ${files.length} file(s) to ${targetDir}`, 'success');
      }
      setStatus('done');
      setTimeout(onClose, 800);
    } catch (e: unknown) {
      const errStr = e instanceof Error ? e.message : String(e);
      setErrorMsg(errStr || 'Transfer failed');
      setStatus('error');
    }
  };

  const fmtSize = (b?: number) => {
    if (!b) return '';
    if (b >= 1e9) return (b / 1e9).toFixed(1) + ' GB';
    if (b >= 1e6) return (b / 1e6).toFixed(1) + ' MB';
    return (b / 1e3).toFixed(1) + ' KB';
  };

  return (
    <div className="ssh-transfer-overlay" onClick={onClose}>
      <div className="ssh-transfer-dialog" onClick={(e) => e.stopPropagation()}>
        <h3>{mode === 'upload' ? '📤 Upload to Server' : '⬇️ Download from Server'}</h3>
        <div className="ssh-transfer-host">🌐 {connection.host}</div>

        {mode === 'upload' && files && (
          <>
            <div className="ssh-transfer-files">
              {files.map((f, i) => (
                <div key={i} className="ssh-transfer-file-item">
                  <span>📄 {f.name}</span>
                  {f.size !== undefined && (
                    <span className="ssh-transfer-size">{fmtSize(f.size)}</span>
                  )}
                </div>
              ))}
            </div>
            <label className="ssh-transfer-label">Remote destination:</label>
            <input
              className="ssh-transfer-input"
              value={targetDir}
              onChange={(e) => setTargetDir(e.target.value)}
              placeholder="~/uploads/"
            />
          </>
        )}

        {mode === 'download' && remotePath && (
          <div className="ssh-transfer-file-item">
            <span>📄 {remotePath}</span>
          </div>
        )}

        {status === 'transferring' && (
          <div className="ssh-transfer-progress">
            <div className="ssh-transfer-progress-bar">
              <div className="ssh-transfer-progress-fill indeterminate" />
            </div>
            <span>Transferring...</span>
          </div>
        )}

        {status === 'error' && (
          <div className="ssh-transfer-error">❌ {errorMsg}</div>
        )}

        {status === 'done' && (
          <div className="ssh-transfer-success">✅ Transfer complete!</div>
        )}

        <div className="ssh-transfer-actions">
          <button className="ssh-transfer-btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="ssh-transfer-btn primary"
            onClick={handleTransfer}
            disabled={status === 'transferring' || status === 'done'}
          >
            {mode === 'upload' ? 'Upload' : 'Download'}
          </button>
        </div>
      </div>
    </div>
  );
}
