// Cloudflare Pages Function to initiate OAuth flow
export async function onRequestGet(context) {
  const { env } = context;

  const clientId = env.OAUTH_CLIENT_ID;
  const redirectUri = `${new URL(context.request.url).origin}/api/auth/callback`;

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=repo,user`;

  return Response.redirect(githubAuthUrl, 302);
}
