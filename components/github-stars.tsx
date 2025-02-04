import GithubButton from './ui/github-button'

export default async function GithubStars() {
  const url = 'https://api.github.com/repos/nicolasmontone/ai-sdk-agents'

  const data = await fetch(url).then((res) => res.json())
  const { stargazers_count: stars } = data

  return <GithubButton count={stars} />
}
