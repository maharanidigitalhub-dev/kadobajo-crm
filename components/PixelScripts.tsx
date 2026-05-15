// Server component — fetches pixel config and injects scripts
const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

interface Pixel {
  id: string;
  platform: string;
  pixel_id: string;
  active: boolean;
}

async function getPixels(): Promise<Pixel[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/cms_content?id=eq.pixels&select=content`,
      {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        cache: 'no-store',
      }
    );
    const data = await res.json();
    return data?.[0]?.content?.pixels ?? [];
  } catch {
    return [];
  }
}

export default async function PixelScripts() {
  const pixels = await getPixels();
  const active = pixels.filter(p => p.active);
  if (!active.length) return null;

  const scripts: string[] = [];

  for (const pixel of active) {
    const id = pixel.pixel_id.trim();
    if (!id) continue;

    switch (pixel.platform) {

      case 'gtm':
        scripts.push(`
          <!-- Google Tag Manager -->
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${id}');
          <!-- End Google Tag Manager -->
        `);
        break;

      case 'meta':
        scripts.push(`
          <!-- Meta Pixel -->
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
          document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${id}');
          fbq('track', 'PageView');
          <!-- End Meta Pixel -->
        `);
        break;

      case 'google_analytics':
        scripts.push(`
          <!-- Google Analytics 4 -->
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
          <!-- End Google Analytics -->
        `);
        break;

      case 'google_ads':
        scripts.push(`
          <!-- Google Ads -->
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
          <!-- End Google Ads -->
        `);
        break;

      case 'tiktok':
        scripts.push(`
          <!-- TikTok Pixel -->
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
            ttq.load('${id}');
            ttq.page();
          }(window, document, 'ttq');
          <!-- End TikTok Pixel -->
        `);
        break;

      case 'snapchat':
        scripts.push(`
          <!-- Snapchat Pixel -->
          (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];var s='script';r=t.createElement(s);r.async=!0;r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u);})(window,document,'https://sc-static.net/scevent.min.js');
          snaptr('init', '${id}', {});
          snaptr('track', 'PAGE_VIEW');
          <!-- End Snapchat Pixel -->
        `);
        break;

      case 'twitter':
        scripts.push(`
          <!-- X (Twitter) Pixel -->
          !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
          twq('config','${id}');
          <!-- End X Pixel -->
        `);
        break;

      case 'pinterest':
        scripts.push(`
          <!-- Pinterest Tag -->
          !function(e){if(!window.pintrk){window.pintrk = function () {window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
          pintrk('load', '${id}');
          pintrk('page');
          <!-- End Pinterest Tag -->
        `);
        break;
    }
  }

  // External src tags needed (GTM, GA4, Google Ads)
  const srcTags = active.flatMap(pixel => {
    const id = pixel.pixel_id.trim();
    if (pixel.platform === 'gtm') return [];
    if (pixel.platform === 'google_analytics') return [`https://www.googletagmanager.com/gtag/js?id=${id}`];
    if (pixel.platform === 'google_ads') return [`https://www.googletagmanager.com/gtag/js?id=${id}`];
    return [];
  });

  return (
    <>
      {/* External script tags */}
      {srcTags.map((src, i) => (
        <script key={`src-${i}`} async src={src} />
      ))}

      {/* GTM noscript (body) */}
      {active.filter(p => p.platform === 'gtm').map(p => (
        <noscript key={`gtm-ns-${p.id}`}>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${p.pixel_id}`}
            height="0" width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      ))}

      {/* Meta Pixel noscript */}
      {active.filter(p => p.platform === 'meta').map(p => (
        <noscript key={`meta-ns-${p.id}`}>
          <img height="1" width="1" style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${p.pixel_id}&ev=PageView&noscript=1`}
          />
        </noscript>
      ))}

      {/* Inline scripts */}
      {scripts.map((script, i) => (
        <script key={`pixel-${i}`} dangerouslySetInnerHTML={{ __html: script }} />
      ))}
    </>
  );
}
