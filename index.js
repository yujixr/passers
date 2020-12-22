addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with proxied data
 * @param {Request} request
 */
async function handleRequest(request) {
  try {
    const baseurl = new URL(request.url);
    const url = `https://${baseurl.pathname.slice(1)}${baseurl.search}`;
    const headers = new Headers({
      "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Referer": "https://www.google.com/search"
    });
    const res = await fetch(url, { headers })

    const content_type = res.headers.get("content-type");
    if ((content_type.indexOf("charset=") == -1 && content_type.indexOf("text/") == -1 && content_type.indexOf("javascript") == -1)
      || content_type.indexOf("svg") != -1
      || content_type.indexOf("woff") != -1) {
      return res;
    }

    const host = baseurl.host;
    const html = (await res.text())
      .replaceAll(`https://`, `https://passers.yuji.workers.dev/`)
      .replaceAll(`http://`, `https://passers.yuji.workers.dev/`)
      .replaceAll(`href="//`, `href="https://passers.yuji.workers.dev/`)
      .replaceAll(`href='//`, `href='https://passers.yuji.workers.dev/`)
      .replaceAll(`href=//`, `href=https://passers.yuji.workers.dev/`)
      .replaceAll(`href="/`, `href="https://passers.yuji.workers.dev/${host}/`)
      .replaceAll(`href='/`, `href='https://passers.yuji.workers.dev/${host}/`)
      .replaceAll(`href=/`, `href=https://passers.yuji.workers.dev/${host}/`)
      .replaceAll(`src="//`, `src="https://passers.yuji.workers.dev/`)
      .replaceAll(`src='//`, `src='https://passers.yuji.workers.dev/`)
      .replaceAll(`src=//`, `src=https://passers.yuji.workers.dev/`)
      .replaceAll(`src="/`, `src="https://passers.yuji.workers.dev/${host}/`)
      .replaceAll(`src='/`, `src='https://passers.yuji.workers.dev/${host}/`)
      .replaceAll(`src=/`, `src=https://passers.yuji.workers.dev/${host}/`)
      .replaceAll(/integrity=['"]sha[\d]{3}-[\B]+?['"]/g, '')
      .replaceAll(/integrity=sha[\d]{3}-[\B]+?/g, '');

    return new Response(html, {
      headers: { 'content-type': content_type },
    });
  } catch (e) {
    return new Response(e.name + e.message, {
      headers: { 'content-type': 'text/plain' },
    });
  }
}
