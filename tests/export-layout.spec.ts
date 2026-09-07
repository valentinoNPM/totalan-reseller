import { expect, test } from '@playwright/test';

test('PNG export uses the full fixed-width invoice layout on a phone viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.setContent(`
    <div class="invoice-preview-shell">
      <div class="invoice-document invoice-exporting">
        <header class="invoice-header">
          <div><h3>TOTALAN RESELLER</h3></div>
          <div class="invoice-customer"><strong>Reseller</strong></div>
        </header>
        <table class="invoice-table">
          <thead><tr><th>Produk</th><th>Harga</th><th>Qty</th><th>Subtotal</th></tr></thead>
          <tbody><tr><td>FEBBY</td><td>Rp79.000</td><td>50</td><td>Rp3.950.000</td></tr></tbody>
        </table>
      </div>
    </div>
  `);
  await page.addStyleTag({ path: 'src/index.css' });
  await page.addStyleTag({ path: 'src/features/totalan/totalan.css' });

  const layout = await page.locator('.invoice-document').evaluate((element) => {
    const invoice = element as HTMLElement;
    const cells = Array.from(invoice.querySelectorAll('td')) as HTMLElement[];
    return {
      width: invoice.getBoundingClientRect().width,
      scrollWidth: invoice.scrollWidth,
      qtyWidth: cells[2].getBoundingClientRect().width,
      qtyHeight: cells[2].getBoundingClientRect().height,
    };
  });

  expect(layout.width).toBe(760);
  expect(layout.scrollWidth).toBe(758);
  expect(layout.qtyWidth).toBeGreaterThan(60);
  expect(layout.qtyHeight).toBeLessThan(50);
});
