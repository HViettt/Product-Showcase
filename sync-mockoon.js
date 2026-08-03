/**
 * sync-mockoon.js
 *
 * mockoon-data.json lưu response của Mockoon dưới dạng INLINE JSON (nhúng cứng
 * trong từng route), hoàn toàn độc lập với products.json / product-details.json.
 * Vì vậy sau khi chạy `node generate-mock.js` để tạo lại data (ví dụ đổi ảnh
 * placeholder), phải chạy thêm script này để đồng bộ ngược nội dung mới vào
 * mockoon-data.json, nếu không Mockoon CLI (chạy trong Docker) vẫn sẽ trả về
 * data cũ.
 *
 * Script này còn sửa 1 bug quan trọng: route GET /api/product/:id trước đây
 * chỉ có DUY NHẤT 1 response tĩnh (luôn trả về prod-001) và không có "rules"
 * nào match theo path param :id, nên bấm vào sản phẩm bất kỳ cũng ra cùng 1
 * kết quả. Script sẽ tạo lại route này với N response (N = số sản phẩm),
 * mỗi response có 1 rule match đúng path param "id", cộng thêm 1 response
 * 404 mặc định (fallback) cho id không tồn tại.
 *
 * Cách dùng:
 *   node generate-mock.js
 *   node sync-mockoon.js
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function buildProductDetailResponse(productId, productDetail) {
  const body = {
    success: true,
    message: 'Product fetched successfully',
    data: productDetail,
  };

  return {
    uuid: crypto.randomUUID(),
    body: JSON.stringify(body, null, 2),
    latency: 0,
    statusCode: 200,
    label: `Auto-generated: ${productId}`,
    headers: [],
    bodyType: 'INLINE',
    filePath: '',
    databucketID: '',
    sendFileAsBody: false,
    rules: [
      {
        target: 'params',
        modifier: 'id',
        value: productId,
        invert: false,
        operator: 'equals',
      },
    ],
    rulesOperator: 'OR',
    disableTemplating: false,
    fallbackTo404: false,
    default: false,
    crudKey: 'id',
    callbacks: [],
  };
}

function buildNotFoundResponse() {
  return {
    uuid: crypto.randomUUID(),
    body: '{\r\n  "success": false,\r\n  "message": "Product not found"\r\n}',
    latency: 0,
    statusCode: 404,
    label: 'Fallback: product not found',
    headers: [],
    bodyType: 'INLINE',
    filePath: '',
    databucketID: '',
    sendFileAsBody: false,
    rules: [],
    rulesOperator: 'OR',
    disableTemplating: false,
    fallbackTo404: false,
    default: true,
    crudKey: 'id',
    callbacks: [],
  };
}

function main() {
  const productsPath = path.join(__dirname, 'products.json');
  const productDetailsPath = path.join(__dirname, 'product-details.json');
  const mockoonPath = path.join(__dirname, 'mockoon-data.json');

  if (!fs.existsSync(productsPath) || !fs.existsSync(productDetailsPath)) {
    console.error('Không tìm thấy products.json hoặc product-details.json. Hãy chạy `node generate-mock.js` trước.');
    process.exit(1);
  }

  const productsData = readJson(productsPath); // { success, message, data: [...] }
  const productDetailsData = readJson(productDetailsPath); // { "prod-001": {...}, ... }
  const mockoonData = readJson(mockoonPath);

  let updatedProductList = false;
  let updatedProductDetail = false;

  for (const route of mockoonData.routes || []) {
    // Route danh sách sản phẩm: cập nhật lại toàn bộ body theo data mới
    if (route.method === 'get' && route.endpoint === 'api/product') {
      const okResponse = route.responses?.[0];
      if (okResponse) {
        okResponse.body = JSON.stringify(productsData, null, 2);
        updatedProductList = true;
      }
    }

    // Route chi tiết sản phẩm: build lại toàn bộ danh sách response,
    // mỗi sản phẩm 1 response match theo :id, cộng 1 response 404 fallback
    if (route.method === 'get' && route.endpoint === 'api/product/:id') {
      const productIds = Object.keys(productDetailsData);
      const perProductResponses = productIds.map((id) =>
        buildProductDetailResponse(id, productDetailsData[id])
      );
      route.responses = [...perProductResponses, buildNotFoundResponse()];
      updatedProductDetail = true;
    }
  }

  if (!updatedProductList) {
    console.warn('Cảnh báo: không tìm thấy route GET /api/product để cập nhật.');
  }
  if (!updatedProductDetail) {
    console.warn('Cảnh báo: không tìm thấy route GET /api/product/:id để cập nhật.');
  }

  fs.writeFileSync(mockoonPath, JSON.stringify(mockoonData, null, 2), 'utf8');

  console.log('Đã đồng bộ mockoon-data.json thành công.');
  console.log(`- GET /api/product: ${updatedProductList ? 'OK' : 'BỎ QUA'}`);
  console.log(
    `- GET /api/product/:id: ${updatedProductDetail ? `OK (${Object.keys(productDetailsData).length} response theo từng id + 1 fallback 404)` : 'BỎ QUA'}`
  );
}

main();