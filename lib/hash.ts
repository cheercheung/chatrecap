import crypto from 'crypto';
import { SnowflakeIdv1 } from 'simple-flakeid';

export function md5(data: string): string {
  return crypto.createHash('md5').update(data).digest('hex');
}

export function sha256(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function generateRandomString(length: number): string {
  return crypto.randomBytes(length).toString('hex');
}

// Add the missing getSnowId function
export function getSnowId(): string {
  const snowflake = new SnowflakeIdv1({ workerId: 1 });
  return snowflake.NextId().toString();
}
