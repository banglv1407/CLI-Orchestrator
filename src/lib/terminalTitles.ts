import type { SessionInfo, TerminalAgentSessionTitle } from '../types';

export function getMiniTerminalTitle(
  session: SessionInfo,
  terminalTitle?: string,
  agentSession?: TerminalAgentSessionTitle,
): string {
  const fallback = session.workingDir ? `${session.cliName} — ${session.workingDir}` : session.cliName;
  if (agentSession?.agent === 'hermes') {
    // A current untitled conversation must not inherit the initial resume name
    // or cmd.exe's launch command (which may contain a different session ID).
    return agentSession.title?.trim() || fallback;
  }
  if (session.agent === 'hermes' || /^(hm|hermes)$/i.test(session.cliName)) {
    return session.title?.trim() || fallback;
  }
  return terminalTitle?.trim() || session.title?.trim() || fallback;
}
