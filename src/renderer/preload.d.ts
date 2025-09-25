import { Channels } from 'main/preload';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(
          channel: Channels,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: Channels, func: (...args: unknown[]) => void): void;
        loadFile(filePath: string): Promise<any>;
        saveFile(serverLocation: string, fileName: string, filePath: string): Promise<void>;
      };
    };
  }
}

export {};
