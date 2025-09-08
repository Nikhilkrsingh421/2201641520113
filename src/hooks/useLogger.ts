interface LogEntry {
  logID: string;
  timestamp: string;
  stack: 'frontend' | 'backend';
  level: 'info' | 'error' | 'debug';
  package: string;
  message: string;
}

const useLogger = () => {
  const logEvent = ({ stack, level, package: pkg, message }: Omit<LogEntry, 'logID' | 'timestamp'>) => {
    const logEntry: LogEntry = {
      logID: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      stack,
      level,
      package: pkg,
      message
    };
    
    // In a real app, this would send to backend
    console.log(`[${logEntry.level.toUpperCase()}] ${logEntry.package}: ${logEntry.message}`, logEntry);
    
    // Store in localStorage for demo purposes
    try {
      const existingLogs = JSON.parse(localStorage.getItem('ai-generator-logs') || '[]');
      existingLogs.push(logEntry);
      localStorage.setItem('ai-generator-logs', JSON.stringify(existingLogs.slice(-100))); // Keep last 100 logs
    } catch (error) {
      console.error('Failed to store log:', error);
    }
    
    return logEntry;
  };

  return { logEvent };
};

export default useLogger;