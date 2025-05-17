import { load } from '@std/dotenv'

await load({ export: true, envPath: import.meta.dirname + '/../.env' })

const githubToken = Deno.env.get('GITHUB_TOKEN')
const githubRepository = Deno.env.get('GITHUB_REPOSITORY')

if (!githubToken || !githubRepository) {
  throw new Error('GITHUB_TOKEN and GITHUB_REPOSITORY must be set')
}

const command = new Deno.Command('deno', {
  args: ['run', '-A', 'jsr:@deno/bump-workspaces/cli'],
  env: {
    GITHUB_TOKEN: githubToken,
    GITHUB_REPOSITORY: githubRepository,
  },
  stdin: 'inherit',
  stderr: 'inherit',
  stdout: 'inherit',
})

const { code } = await command.output()
Deno.exit(code)
