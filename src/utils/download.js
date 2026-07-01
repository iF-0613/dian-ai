import JSZip from 'jszip';
import { toPng } from 'html-to-image';

export function downloadText(filename, content, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([content || ''], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function downloadNodeAsPng(node, filename) {
  if (!node) throw new Error('没有可导出的画布');
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: '#fffaf2',
  });
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
  return dataUrl;
}

export function printAsPdf(title, content) {
  const printWindow = window.open('', '_blank', 'width=900,height=1200');
  if (!printWindow) return;
  printWindow.document.write(`<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    body{font-family:-apple-system,BlinkMacSystemFont,"Microsoft YaHei",sans-serif;margin:40px;color:#1c1917}
    h1{font-size:28px;margin:0 0 20px}
    pre{white-space:pre-wrap;word-break:break-word;font-size:15px;line-height:1.9}
  </style>
</head>
<body>
  <h1>${title}</h1>
  <pre>${String(content || '').replace(/[<>&]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[char]))}</pre>
  <script>window.onload=function(){window.print()}</script>
</body>
</html>`);
  printWindow.document.close();
}

export function buildMarketingHtml(form) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${form.storeName} - 宣传网页</title>
  <style>
    body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Microsoft YaHei",sans-serif;background:#fff8ef;color:#231f20}
    .hero{padding:64px 24px;background:linear-gradient(135deg,#f3dfc2,#fff6e8,#cfe7d8)}
    .wrap{max-width:920px;margin:0 auto}
    h1{font-size:56px;line-height:1.05;margin:16px 0;font-weight:900}
    p{font-size:18px;line-height:1.8}
    .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin:32px 0}
    .card{background:#fff;border-radius:24px;padding:24px;box-shadow:0 12px 40px rgba(0,0,0,.08)}
    .price{display:inline-block;background:#047857;color:white;border-radius:20px;padding:18px 24px;font-size:32px;font-weight:900}
    .cta{background:#111;color:#fff;text-align:center;border-radius:20px;padding:18px;margin-top:24px;font-weight:900}
  </style>
</head>
<body>
  <section class="hero"><div class="wrap">
    <strong>${form.industryType} · 新客体验</strong>
    <h1>${form.headline}</h1>
    <p>${form.subheadline}</p>
    <div class="price">${form.price}</div>
  </div></section>
  <main class="wrap">
    <div class="cards">${form.services.map((item) => `<div class="card"><h3>${item}</h3><p>舒适体验，细致服务，适合本地顾客到店体验。</p></div>`).join('')}</div>
    <div class="card">
      <h2>${form.storeName}</h2>
      <p>电话：${form.phone}</p>
      <p>地址：${form.address}</p>
      <p>微信：${form.wechat}</p>
      <div class="cta">立即预约体验</div>
    </div>
  </main>
</body>
</html>`;
}

export async function exportMarketingPackage({
  projectName,
  form,
  copy,
  posterNode,
}) {
  const zip = new JSZip();
  const safeName = projectName || form.storeName || '店宣AI营销素材包';

  if (posterNode) {
    const dataUrl = await toPng(posterNode, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#fffaf2',
    });
    zip.file('宣传海报.png', dataUrl.split(',')[1], { base64: true });
  }

  if (copy?.moments) zip.file('朋友圈文案.txt', copy.moments);
  if (copy?.redbook) zip.file('小红书文案.txt', copy.redbook);
  if (copy?.douyin) zip.file('抖音口播稿.txt', copy.douyin);
  zip.file('宣传网页.html', buildMarketingHtml(form));

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${safeName}.zip`;
  link.click();
  URL.revokeObjectURL(url);
}
