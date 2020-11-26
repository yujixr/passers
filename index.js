addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const baseurl = new URL(request.url);
  const url = `https://${baseurl.pathname.slice(1)}${baseurl.search}`;

  if (url == 'https://') {
    return new Response('', {
      headers: { 'content-type': 'text/plain' },
    });
  }

  const headers = new Headers({
    "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Referer": "https://www.google.com"
  });
  const res = await fetch(url, { headers })
  let html = (await res.text())
    .replaceAll(`href="/`, `href="https://passers.yuji.workers.dev/${(new URL(url)).host}/`)
    .replaceAll(`href='/`, `href='https://passers.yuji.workers.dev/${(new URL(url)).host}/`)
    .replaceAll(`href=/`, `href=https://passers.yuji.workers.dev/${(new URL(url)).host}/`)
    .replaceAll(`src="/`, `src="https://${(new URL(url)).host}/`)
    .replaceAll(`src='/`, `src='https://${(new URL(url)).host}/`)
    .replaceAll(`src=/`, `src=https://${(new URL(url)).host}/`)
    .replaceAll(`<link>https://`, `<link>https://passers.yuji.workers.dev/`);

  return new Response(html, {
    headers: { 'content-type': res.headers.get("content-type") },
  });
}
