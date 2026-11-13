import { envSchema, type Env } from './schema';

type ValidateEnvOptions = {
  exitOnError?: boolean;
};

export function validateEnv(
  raw: Record<string, string | undefined>,
  options: ValidateEnvOptions = {}
): Env {
  const parsed = envSchema.safeParse(raw);

  if (!parsed.success) {
    console.error('\n\x1b[1;31m[!] ENV_CONFIGURATION_ERROR\x1b[0m');

    parsed.error.issues.forEach((issue) => {
      const path = issue.path.join('.') || 'root';
      console.error(
        ` \x1b[31m> \x1b[0m \x1b[1m${path}\x1b[0m: \x1b[31m${issue.message}\x1b[0m`
      );
    });

    console.error('\n\x1b[33mHint:\x1b[0m Проверьте файл .env (см. .env.example)\n');

    if (options.exitOnError) {
      process.exit(1);
    }

    throw new Error('Environment validation failed');
  }

  return parsed.data;
}
