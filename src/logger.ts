import { Logger } from 'koishi';

export interface DebugConfig
{
  loggerinfo?: boolean;
  config?: DebugConfig;
  parent?: DebugConfig;
}

const debugLogger = new Logger('DEV:adapter-qq-crack');

function isDebugEnabled(config: DebugConfig | undefined): boolean
{
  if (!config) return false;
  if (typeof config.loggerinfo === 'boolean') return config.loggerinfo;
  return isDebugEnabled(config.config) || isDebugEnabled(config.parent);
}

export function logDebug(config: DebugConfig | undefined, message: string, ...args: unknown[])
{
  if (!isDebugEnabled(config)) return;
  debugLogger.info(message, ...args);
}
