import fs from 'fs';
import path from 'path';

// ==========================================
// CONSTANTS & SEED DATA
// ==========================================

const BRANDS = {
  Laptop: ['Apple', 'Dell', 'Lenovo', 'ASUS', 'HP', 'Acer', 'MSI'],
  Smartphone: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Nothing', 'Xiaomi'],
  Tablet: ['Apple', 'Samsung', 'Lenovo'],
  Smartwatch: ['Apple', 'Samsung', 'Garmin'],
  Headphone: ['Apple', 'Sony', 'Bose', 'JBL', 'Sennheiser'],
  Camera: ['Sony', 'Canon', 'Nikon', 'Fujifilm'],
  Accessory: ['Logitech', 'Anker', 'UGREEN', 'Samsung', 'Apple']
};

const BRAND_CODES = {
  Apple: 'APL',
  Dell: 'DEL',
  Lenovo: 'LNV',
  ASUS: 'ASU',
  HP: 'HPP',
  Acer: 'ACR',
  MSI: 'MSI',
  Samsung: 'SAM',
  Google: 'GGL',
  OnePlus: '1PL',
  Nothing: 'NTH',
  Xiaomi: 'XIA',
  Garmin: 'GAR',
  Sony: 'SON',
  Bose: 'BOS',
  JBL: 'JBL',
  Sennheiser: 'SNH',
  Canon: 'CAN',
  Nikon: 'NIK',
  Fujifilm: 'FUJ',
  Logitech: 'LOG',
  Anker: 'ANK',
  UGREEN: 'UGR'
};

const COLOR_PALETTE = ['Space Gray', 'Silver', 'Midnight', 'Starlight', 'Black', 'White', 'Titanium Natural', 'Deep Blue'];

const TAGS_POOL = ['Best Seller', 'New Arrival', 'Flagship', 'Premium', 'Eco-Friendly', 'Wireless', 'Fast Charge', 'High Performance'];

const PRODUCT_TEMPLATES = [
  // Laptops (18)
  { category: 'Laptop', brand: 'Apple', model: 'MacBook Air M4 13-inch', modelCode: 'MBA13-M4', priceMin: 28000000, priceMax: 35000000, year: 2025 },
  { category: 'Laptop', brand: 'Apple', model: 'MacBook Air M4 15-inch', modelCode: 'MBA15-M4', priceMin: 34000000, priceMax: 42000000, year: 2025 },
  { category: 'Laptop', brand: 'Apple', model: 'MacBook Pro 14 M4', modelCode: 'MBP14-M4', priceMin: 39900000, priceMax: 52000000, year: 2025 },
  { category: 'Laptop', brand: 'Apple', model: 'MacBook Pro 16 M4 Max', modelCode: 'MBP16-MAX', priceMin: 55000000, priceMax: 60000000, year: 2025 },
  { category: 'Laptop', brand: 'Dell', model: 'Dell XPS 14 9440', modelCode: 'XPS14', priceMin: 42000000, priceMax: 55000000, year: 2024 },
  { category: 'Laptop', brand: 'Dell', model: 'Dell XPS 16 9640', modelCode: 'XPS16', priceMin: 48000000, priceMax: 60000000, year: 2024 },
  { category: 'Laptop', brand: 'Dell', model: 'Dell Inspiron 16 Plus', modelCode: 'INS16P', priceMin: 22000000, priceMax: 32000000, year: 2024 },
  { category: 'Laptop', brand: 'Lenovo', model: 'ThinkPad X1 Carbon Gen 12', modelCode: 'X1C-G12', priceMin: 45000000, priceMax: 58000000, year: 2024 },
  { category: 'Laptop', brand: 'Lenovo', model: 'Legion Pro 7i Gen 9', modelCode: 'LEG7I', priceMin: 50000000, priceMax: 60000000, year: 2025 },
  { category: 'Laptop', brand: 'Lenovo', model: 'Yoga Slim 7i Aura Edition', modelCode: 'YOGA7I', priceMin: 28000000, priceMax: 38000000, year: 2025 },
  { category: 'Laptop', brand: 'ASUS', model: 'ASUS Zenbook S 14 OLED', modelCode: 'UX5406', priceMin: 32000000, priceMax: 42000000, year: 2025 },
  { category: 'Laptop', brand: 'ASUS', model: 'ASUS ROG Zephyrus G16', modelCode: 'GA605', priceMin: 48000000, priceMax: 60000000, year: 2024 },
  { category: 'Laptop', brand: 'ASUS', model: 'ASUS Vivobook Pro 15 OLED', modelCode: 'N6506', priceMin: 25000000, priceMax: 35000000, year: 2024 },
  { category: 'Laptop', brand: 'HP', model: 'HP Spectre x360 14', modelCode: 'SPC14', priceMin: 36000000, priceMax: 48000000, year: 2024 },
  { category: 'Laptop', brand: 'HP', model: 'HP OmniBook X AI', modelCode: 'OMNIX', priceMin: 29000000, priceMax: 39000000, year: 2025 },
  { category: 'Laptop', brand: 'Acer', model: 'Acer Swift Go 14 AI', modelCode: 'SFG14', priceMin: 20000000, priceMax: 28000000, year: 2024 },
  { category: 'Laptop', brand: 'Acer', model: 'Acer Predator Helios 18', modelCode: 'PH18', priceMin: 52000000, priceMax: 60000000, year: 2024 },
  { category: 'Laptop', brand: 'MSI', model: 'MSI Prestige 16 AI Studio', modelCode: 'PRS16', priceMin: 38000000, priceMax: 49000000, year: 2024 },

  // Smartphones (16)
  { category: 'Smartphone', brand: 'Apple', model: 'iPhone 16 128GB', modelCode: 'IP16-128', priceMin: 21990000, priceMax: 22990000, year: 2024 },
  { category: 'Smartphone', brand: 'Apple', model: 'iPhone 16 Plus 256GB', modelCode: 'IP16P-256', priceMin: 25990000, priceMax: 27990000, year: 2024 },
  { category: 'Smartphone', brand: 'Apple', model: 'iPhone 16 Pro 256GB', modelCode: 'IP16PRO-256', priceMin: 28990000, priceMax: 31990000, year: 2024 },
  { category: 'Smartphone', brand: 'Apple', model: 'iPhone 16 Pro Max 512GB', modelCode: 'IP16PM-512', priceMin: 34990000, priceMax: 40000000, year: 2024 },
  { category: 'Smartphone', brand: 'Samsung', model: 'Galaxy S25 256GB', modelCode: 'S25-256', priceMin: 21000000, priceMax: 23000000, year: 2025 },
  { category: 'Smartphone', brand: 'Samsung', model: 'Galaxy S25 Plus 512GB', modelCode: 'S25P-512', priceMin: 26000000, priceMax: 29000000, year: 2025 },
  { category: 'Smartphone', brand: 'Samsung', model: 'Galaxy S25 Ultra 512GB', modelCode: 'S25U-512', priceMin: 32000000, priceMax: 38000000, year: 2025 },
  { category: 'Smartphone', brand: 'Samsung', model: 'Galaxy Z Fold 6 512GB', modelCode: 'ZFOLD6', priceMin: 38000000, priceMax: 40000000, year: 2024 },
  { category: 'Smartphone', brand: 'Google', model: 'Google Pixel 9 128GB', modelCode: 'PIX9-128', priceMin: 18000000, priceMax: 21000000, year: 2024 },
  { category: 'Smartphone', brand: 'Google', model: 'Google Pixel 9 Pro XL', modelCode: 'PIX9PXL', priceMin: 28000000, priceMax: 34000000, year: 2024 },
  { category: 'Smartphone', brand: 'Google', model: 'Google Pixel 10 Pro', modelCode: 'PIX10P', priceMin: 30000000, priceMax: 36000000, year: 2025 },
  { category: 'Smartphone', brand: 'OnePlus', model: 'OnePlus 12 512GB', modelCode: 'OP12-512', priceMin: 19000000, priceMax: 22000000, year: 2024 },
  { category: 'Smartphone', brand: 'OnePlus', model: 'OnePlus 13 Pro', modelCode: 'OP13P', priceMin: 24000000, priceMax: 29000000, year: 2025 },
  { category: 'Smartphone', brand: 'Nothing', model: 'Nothing Phone 2a Plus', modelCode: 'NTH2AP', priceMin: 10000000, priceMax: 13000000, year: 2024 },
  { category: 'Smartphone', brand: 'Nothing', model: 'Nothing Phone 3', modelCode: 'NTH3', priceMin: 17000000, priceMax: 22000000, year: 2025 },
  { category: 'Smartphone', brand: 'Xiaomi', model: 'Xiaomi 15 Ultra 512GB', modelCode: 'MI15U', priceMin: 29000000, priceMax: 34000000, year: 2025 },

  // Tablets (12)
  { category: 'Tablet', brand: 'Apple', model: 'iPad Air 11-inch M3', modelCode: 'IPADAIR-M3', priceMin: 16990000, priceMax: 21000000, year: 2024 },
  { category: 'Tablet', brand: 'Apple', model: 'iPad Air 13-inch M3', modelCode: 'IPADAIR13-M3', priceMin: 21990000, priceMax: 26000000, year: 2024 },
  { category: 'Tablet', brand: 'Apple', model: 'iPad Pro 11-inch M4', modelCode: 'IPADPRO11-M4', priceMin: 28990000, priceMax: 33000000, year: 2024 },
  { category: 'Tablet', brand: 'Apple', model: 'iPad Pro 13-inch M4 1TB', modelCode: 'IPADPRO13-M4', priceMin: 34000000, priceMax: 35000000, year: 2024 },
  { category: 'Tablet', brand: 'Apple', model: 'iPad mini 7 A17 Pro', modelCode: 'IPADMINI7', priceMin: 13990000, priceMax: 17000000, year: 2024 },
  { category: 'Tablet', brand: 'Samsung', model: 'Galaxy Tab S10 FE Plus', modelCode: 'TABS10FE', priceMin: 12000000, priceMax: 16000000, year: 2025 },
  { category: 'Tablet', brand: 'Samsung', model: 'Galaxy Tab S10 Plus 5G', modelCode: 'TABS10P', priceMin: 24000000, priceMax: 28000000, year: 2024 },
  { category: 'Tablet', brand: 'Samsung', model: 'Galaxy Tab S10 Ultra 512GB', modelCode: 'TABS10U', priceMin: 30000000, priceMax: 35000000, year: 2024 },
  { category: 'Tablet', brand: 'Samsung', model: 'Galaxy Tab A9 Plus LTE', modelCode: 'TABA9P', priceMin: 8000000, priceMax: 9500000, year: 2024 },
  { category: 'Tablet', brand: 'Lenovo', model: 'Lenovo Tab Extreme 14.5', modelCode: 'TABEXT', priceMin: 22000000, priceMax: 27000000, year: 2024 },
  { category: 'Tablet', brand: 'Lenovo', model: 'Lenovo Legion Tab Gen 2', modelCode: 'LEGTAB2', priceMin: 11000000, priceMax: 14000000, year: 2024 },
  { category: 'Tablet', brand: 'Lenovo', model: 'Lenovo Tab P12 Pro', modelCode: 'TABP12P', priceMin: 15000000, priceMax: 19000000, year: 2024 },

  // Cameras (12)
  { category: 'Camera', brand: 'Sony', model: 'Sony Alpha A7 IV Body', modelCode: 'A7IV', priceMin: 55000000, priceMax: 60000000, year: 2024 },
  { category: 'Camera', brand: 'Sony', model: 'Sony Alpha A7C II', modelCode: 'A7C2', priceMin: 48000000, priceMax: 54000000, year: 2024 },
  { category: 'Camera', brand: 'Sony', model: 'Sony ZV-E10 II Kit 16-50mm', modelCode: 'ZVE10-2', priceMin: 23000000, priceMax: 27000000, year: 2024 },
  { category: 'Camera', brand: 'Sony', model: 'Sony Cinema Line FX30', modelCode: 'FX30', priceMin: 42000000, priceMax: 48000000, year: 2024 },
  { category: 'Camera', brand: 'Canon', model: 'Canon EOS R6 Mark II', modelCode: 'EOSR6M2', priceMin: 58000000, priceMax: 66000000, year: 2024 },
  { category: 'Camera', brand: 'Canon', model: 'Canon EOS R8 Body', modelCode: 'EOSR8', priceMin: 32000000, priceMax: 37000000, year: 2024 },
  { category: 'Camera', brand: 'Canon', model: 'Canon EOS R50 Kit', modelCode: 'EOSR50', priceMin: 18000000, priceMax: 22000000, year: 2024 },
  { category: 'Camera', brand: 'Nikon', model: 'Nikon Z6 III Body', modelCode: 'Z6M3', priceMin: 62000000, priceMax: 70000000, year: 2024 },
  { category: 'Camera', brand: 'Nikon', model: 'Nikon Z50 II Kit', modelCode: 'Z50M2', priceMin: 22000000, priceMax: 26000000, year: 2025 },
  { category: 'Camera', brand: 'Nikon', model: 'Nikon Z f Retro Body', modelCode: 'ZF-RETRO', priceMin: 48000000, priceMax: 55000000, year: 2024 },
  { category: 'Camera', brand: 'Fujifilm', model: 'Fujifilm X-T5 Body', modelCode: 'XT5', priceMin: 42000000, priceMax: 47000000, year: 2024 },
  { category: 'Camera', brand: 'Fujifilm', model: 'Fujifilm X100VI Compact', modelCode: 'X100VI', priceMin: 45000000, priceMax: 52000000, year: 2024 },

  // Headphones (20)
  { category: 'Headphone', brand: 'Apple', model: 'AirPods Pro 2 USB-C', modelCode: 'APP2-USBC', priceMin: 5800000, priceMax: 6500000, year: 2024 },
  { category: 'Headphone', brand: 'Apple', model: 'AirPods 4 ANC', modelCode: 'AP4-ANC', priceMin: 4400000, priceMax: 4900000, year: 2024 },
  { category: 'Headphone', brand: 'Apple', model: 'AirPods Max USB-C', modelCode: 'APMAX-C', priceMin: 11500000, priceMax: 12000000, year: 2024 },
  { category: 'Headphone', brand: 'Sony', model: 'Sony WH-1000XM5', modelCode: 'WH1000XM5', priceMin: 7800000, priceMax: 8900000, year: 2024 },
  { category: 'Headphone', brand: 'Sony', model: 'Sony WH-1000XM6', modelCode: 'WH1000XM6', priceMin: 10500000, priceMax: 12000000, year: 2025 },
  { category: 'Headphone', brand: 'Sony', model: 'Sony WF-1000XM5 TWS', modelCode: 'WF1000XM5', priceMin: 5200000, priceMax: 6200000, year: 2024 },
  { category: 'Headphone', brand: 'Sony', model: 'Sony ULT WEAR Bass', modelCode: 'ULT-WEAR', priceMin: 3800000, priceMax: 4500000, year: 2024 },
  { category: 'Headphone', brand: 'Bose', model: 'Bose QuietComfort Ultra Headphones', modelCode: 'QCU-OVER', priceMin: 9500000, priceMax: 11000000, year: 2024 },
  { category: 'Headphone', brand: 'Bose', model: 'Bose QuietComfort Ultra Earbuds', modelCode: 'QCU-EAR', priceMin: 6800000, priceMax: 7900000, year: 2024 },
  { category: 'Headphone', brand: 'Bose', model: 'Bose QuietComfort Headphones', modelCode: 'QC-HD', priceMin: 7200000, priceMax: 8200000, year: 2024 },
  { category: 'Headphone', brand: 'JBL', model: 'JBL Tour Pro 3 Smart Case', modelCode: 'TOURP3', priceMin: 6200000, priceMax: 7200000, year: 2024 },
  { category: 'Headphone', brand: 'JBL', model: 'JBL Live Beam 3 TWS', modelCode: 'LIVEB3', priceMin: 3600000, priceMax: 4200000, year: 2024 },
  { category: 'Headphone', brand: 'JBL', model: 'JBL Tune 770NC Wireless', modelCode: 'TUNE770', priceMin: 2100000, priceMax: 2600000, year: 2024 },
  { category: 'Headphone', brand: 'Sennheiser', model: 'Sennheiser Momentum 4 Wireless', modelCode: 'MOM4-HD', priceMin: 8200000, priceMax: 9500000, year: 2024 },
  { category: 'Headphone', brand: 'Sennheiser', model: 'Sennheiser Momentum True Wireless 4', modelCode: 'MTW4', priceMin: 7500000, priceMax: 8500000, year: 2024 },
  { category: 'Headphone', brand: 'Sennheiser', model: 'Sennheiser ACCENTUM Plus', modelCode: 'ACC-PLUS', priceMin: 4800000, priceMax: 5500000, year: 2024 },
  { category: 'Headphone', brand: 'Sony', model: 'Sony LinkBuds S TWS', modelCode: 'LINKBUDS-S', priceMin: 3200000, priceMax: 3900000, year: 2024 },
  { category: 'Headphone', brand: 'Apple', model: 'Beats Studio Pro Wireless', modelCode: 'BTS-STPRO', priceMin: 7500000, priceMax: 8500000, year: 2024 },
  { category: 'Headphone', brand: 'Apple', model: 'Beats Solo 4 Wireless', modelCode: 'BTS-SOLO4', priceMin: 4500000, priceMax: 5200000, year: 2024 },
  { category: 'Headphone', brand: 'JBL', model: 'JBL Quantum 910 Gaming', modelCode: 'QTM910', priceMin: 5800000, priceMax: 6800000, year: 2024 },

  // Accessories (22)
  { category: 'Accessory', brand: 'Logitech', model: 'Logitech MX Master 3S Mouse', modelCode: 'MXM3S', priceMin: 2400000, priceMax: 2700000, year: 2024 },
  { category: 'Accessory', brand: 'Logitech', model: 'Logitech MX Keys S Keyboard', modelCode: 'MXKEYS-S', priceMin: 2800000, priceMax: 3200000, year: 2024 },
  { category: 'Accessory', brand: 'Logitech', model: 'Logitech G Pro X Superlight 2', modelCode: 'GPROX-SL2', priceMin: 3500000, priceMax: 3900000, year: 2024 },
  { category: 'Accessory', brand: 'Logitech', model: 'Logitech Brio 500 Webcam', modelCode: 'BRIO500', priceMin: 2900000, priceMax: 3300000, year: 2024 },
  { category: 'Accessory', brand: 'Anker', model: 'Anker Prime 20,000mAh Power Bank 200W', modelCode: 'ANK-P200', priceMin: 3200000, priceMax: 3700000, year: 2024 },
  { category: 'Accessory', brand: 'Anker', model: 'Anker Prime Charger 100W GaN', modelCode: 'ANK-C100', priceMin: 1600000, priceMax: 1900000, year: 2024 },
  { category: 'Accessory', brand: 'Anker', model: 'Anker MagGo Wireless Charger 15W', modelCode: 'ANK-MAG15', priceMin: 1100000, priceMax: 1400000, year: 2024 },
  { category: 'Accessory', brand: 'Anker', model: 'Anker Soundcore Motion X600 Speaker', modelCode: 'ANK-X600', priceMin: 4200000, priceMax: 4800000, year: 2024 },
  { category: 'Accessory', brand: 'UGREEN', model: 'UGREEN Revodok Pro 10-in-1 USB-C Hub', modelCode: 'UGR-HUB10', priceMin: 1400000, priceMax: 1800000, year: 2024 },
  { category: 'Accessory', brand: 'UGREEN', model: 'UGREEN Nexode 140W GaN Charger', modelCode: 'UGR-NEX140', priceMin: 1800000, priceMax: 2200000, year: 2024 },
  { category: 'Accessory', brand: 'UGREEN', model: 'UGREEN M.2 NVMe SSD Enclosure 10Gbps', modelCode: 'UGR-NVME', priceMin: 450000, priceMax: 650000, year: 2024 },
  { category: 'Accessory', brand: 'UGREEN', model: 'UGREEN Bluetooth 5.4 Transmitter', modelCode: 'UGR-BT54', priceMin: 350000, priceMax: 480000, year: 2024 },
  { category: 'Accessory', brand: 'Samsung', model: 'Samsung T9 Portable SSD 1TB', modelCode: 'SAM-T9-1TB', priceMin: 3200000, priceMax: 3600000, year: 2024 },
  { category: 'Accessory', brand: 'Samsung', model: 'Samsung T7 Shield 2TB SSD', modelCode: 'SAM-T7S-2TB', priceMin: 4500000, priceMax: 5000000, year: 2024 },
  { category: 'Accessory', brand: 'Apple', model: 'Apple Pencil Pro', modelCode: 'APL-PENPRO', priceMin: 3400000, priceMax: 3800000, year: 2024 },
  { category: 'Accessory', brand: 'Apple', model: 'Apple Magic Keyboard for iPad Pro 13', modelCode: 'APL-MKB13', priceMin: 4500000, priceMax: 4900000, year: 2024 },
  { category: 'Accessory', brand: 'Apple', model: 'Apple 140W USB-C Power Adapter', modelCode: 'APL-140W', priceMin: 2400000, priceMax: 2700000, year: 2024 },
  { category: 'Accessory', brand: 'Apple', model: 'Apple AirTag 4 Pack', modelCode: 'APL-AIRTAG4', priceMin: 2200000, priceMax: 2500000, year: 2024 },
  { category: 'Accessory', brand: 'Logitech', model: 'Logitech Wave Keys Ergonomic', modelCode: 'WAVE-KEYS', priceMin: 1800000, priceMax: 2200000, year: 2024 },
  { category: 'Accessory', brand: 'Anker', model: 'Anker 622 Magnetic Battery MagGo 5K', modelCode: 'ANK-622', priceMin: 950000, priceMax: 1200000, year: 2024 },
  { category: 'Accessory', brand: 'UGREEN', model: 'UGREEN Uno 100W Power Bank', modelCode: 'UGR-UNO100', priceMin: 1250000, priceMax: 1500000, year: 2024 },
  { category: 'Accessory', brand: 'Samsung', model: 'Samsung SmartTag2 4-Pack', modelCode: 'SAM-TAG2-4', priceMin: 1800000, priceMax: 2100000, year: 2024 }
];

const WATCH_TEMPLATES = [
  { category: 'Smartwatch', brand: 'Apple', model: 'Apple Watch Series 10 GPS 46mm', modelCode: 'AWS10-46', priceMin: 10990000, priceMax: 12500000, year: 2024 },
  { category: 'Smartwatch', brand: 'Apple', model: 'Apple Watch Ultra 2 Titanium', modelCode: 'AWULTRA2', priceMin: 20990000, priceMax: 22500000, year: 2024 },
  { category: 'Smartwatch', brand: 'Samsung', model: 'Galaxy Watch 7 44mm LTE', modelCode: 'GW7-44', priceMin: 7990000, priceMax: 8900000, year: 2024 },
  { category: 'Smartwatch', brand: 'Samsung', model: 'Galaxy Watch Ultra 47mm', modelCode: 'GWULTRA', priceMin: 14990000, priceMax: 16500000, year: 2024 },
  { category: 'Smartwatch', brand: 'Garmin', model: 'Garmin Fenix 8 Sapphire Solar', modelCode: 'FENIX8', priceMin: 26000000, priceMax: 31000000, year: 2024 },
  { category: 'Smartwatch', brand: 'Garmin', model: 'Garmin Forerunner 265 GPS', modelCode: 'FR265', priceMin: 11000000, priceMax: 13000000, year: 2024 }
];

const ALL_TEMPLATES = [...PRODUCT_TEMPLATES, ...WATCH_TEMPLATES];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, decimals = 1) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomSubarray(array, count) {
  const shuffled = array.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function generateSKU(brand, modelCode, index) {
  const brandPrefix = BRAND_CODES[brand] || 'GEN';
  const numStr = String(index + 1).padStart(3, '0');
  return `${brandPrefix}-${modelCode}-${numStr}`;
}

function generateRandomDate(startStr, endStr) {
  const start = new Date(startStr).getTime();
  const end = new Date(endStr).getTime();
  const randomTime = start + Math.random() * (end - start);
  return new Date(randomTime);
}

function generateSpecifications(category, brand, model) {
  switch (category) {
    case 'Laptop':
      return {
        CPU: brand === 'Apple' ? 'Apple M4 Pro 12-core' : 'Intel Core Ultra 7 155H',
        RAM: '16GB LPDDR5X 7467MHz',
        Storage: '512GB PCIe 4.0 NVMe SSD',
        Display: '14.0-inch OLED 2.8K (2880 x 1800) 120Hz',
        Battery: '75Wh Battery, 100W USB-C PD Charger',
        Weight: '1.32 kg'
      };
    case 'Smartphone':
      return {
        Chip: brand === 'Apple' ? 'Apple A18 Pro 3nm' : 'Snapdragon 8 Gen 3 for Galaxy',
        RAM: '12GB LPDDR5X',
        Storage: '256GB UFS 4.0',
        Display: '6.7-inch LTPO Super Retina XDR OLED 120Hz',
        Battery: '4800 mAh, 45W Fast Charging',
        Camera: '50MP Main + 48MP UltraWide + 12MP Telephoto 5x'
      };
    case 'Tablet':
      return {
        Chip: brand === 'Apple' ? 'Apple M4 Chip' : 'MediaTek Dimensity 9300+',
        RAM: '8GB Unified Memory',
        Storage: '128GB NVMe',
        Display: '11.0-inch Ultra Retina Tandem OLED 120Hz',
        Battery: '8000 mAh, 30W Fast Charge'
      };
    case 'Smartwatch':
      return {
        Chip: brand === 'Apple' ? 'Apple S10 SiP' : 'Exynos W1000 3nm',
        RAM: '2GB',
        Storage: '32GB',
        Display: '1.96-inch Always-On Retina OLED 2000 nits',
        Battery: 'Up to 36 hours (Normal Use)'
      };
    case 'Camera':
      return {
        Sensor: '33.0 MP Full-Frame Exmor R CMOS',
        LensMount: brand === 'Sony' ? 'Sony E-mount' : brand === 'Canon' ? 'Canon RF mount' : 'Nikon Z mount',
        Video: '4K 60p 10-bit 4:2:2 All-Intra Internal',
        Weight: '658g (Body only)'
      };
    case 'Headphone':
      return {
        Driver: '40mm Custom Dynamic Driver',
        ANC: 'Adaptive Active Noise Cancellation with Transparency',
        Battery: 'Up to 30 Hours (ANC ON)',
        Bluetooth: 'Bluetooth 5.4, AAC, LDAC, aptX Lossless',
        Weight: '250g'
      };
    case 'Accessory':
      return {
        Compatibility: 'macOS, Windows 11, iOS, Android',
        Material: 'Anodized Aluminum & Recycled Matte Plastic',
        Dimensions: '124.9 x 84.3 x 51.0 mm',
        Weight: '141g'
      };
    default:
      return {
        Standard: 'Universal Technical Specifications',
        Warranty: 'Official Manufacturer Support'
      };
  }
}

// ==========================================
// DATA GENERATION ENGINE
// ==========================================

function generateDataset() {
  const products = [];
  const productDetails = {};

  const totalCount = ALL_TEMPLATES.length; // Exactly 100 items

  for (let i = 0; i < totalCount; i++) {
    const template = ALL_TEMPLATES[i];
    const id = `prod-${String(i + 1).padStart(3, '0')}`;
    const sku = generateSKU(template.brand, template.modelCode, i);
    const slug = slugify(template.model);

    const originalPrice = Math.round(getRandomInt(template.priceMin, template.priceMax) / 100000) * 100000;
    const discountPercentOptions = [0, 0, 5, 10, 15, 20];
    const discountPercent = getRandomItem(discountPercentOptions);
    const price = Math.round((originalPrice * (100 - discountPercent)) / 100);

    let status = 'Available';
    let stockQuantity = getRandomInt(10, 150);
    const statusRoll = Math.random();
    if (statusRoll < 0.1) {
      status = 'Out of Stock';
      stockQuantity = 0;
    } else if (statusRoll < 0.18) {
      status = 'Coming Soon';
      stockQuantity = getRandomInt(0, 5);
    }

    const inStock = stockQuantity > 0 && status === 'Available';

    const createdDate = generateRandomDate('2024-01-01T00:00:00.000Z', '2025-06-30T23:59:59.000Z');
    const updatedDate = generateRandomDate(createdDate.toISOString(), '2025-12-31T23:59:59.000Z');

    const rating = getRandomFloat(4.0, 5.0, 1);
    const reviewCount = getRandomInt(50, 5000);
    const color = getRandomItem(COLOR_PALETTE);
    const tags = getRandomSubarray(TAGS_POOL, getRandomInt(2, 4));

    const primaryImage = `https://placehold.co/800x800?text=${encodeURIComponent(template.model)}+Front`;
    const galleryImages = [
      primaryImage,
      `https://placehold.co/800x800?text=${encodeURIComponent(template.model)}+Side`,
      `https://placehold.co/800x800?text=${encodeURIComponent(template.model)}+Back`
    ];

    const description = `${template.model} chính hãng thương hiệu ${template.brand}. Thiết kế hiện đại, hiệu năng mạnh mẽ hàng đầu phân khúc năm ${template.year}.`;
    const fullDescription = `${template.model} mang đến trải nghiệm đỉnh cao với sự kết hợp hoàn hảo giữa công nghệ hàng đầu của ${template.brand} và phong cách thiết kế thời thượng. Sản phẩm phù hợp cho mọi nhu cầu làm việc, giải trí và sáng tạo nội dung cao cấp.`;

    // Base Product Object (FOR products.json ONLY)
    const product = {
      id,
      sku,
      slug,
      name: template.model,
      image: primaryImage,
      description,
      category: template.category,
      brand: template.brand,
      price,
      originalPrice,
      discountPercent,
      currency: 'VND',
      inStock,
      stockQuantity,
      status,
      rating,
      reviewCount,
      releaseYear: template.year,
      color,
      tags,
      createdAt: createdDate.toISOString(),
      updatedAt: updatedDate.toISOString()
    };

    // Extended ProductDetail Object (FOR product-details.json ONLY)
    const productDetail = {
      ...product,
      fullDescription,
      specifications: generateSpecifications(template.category, template.brand, template.model),
      images: galleryImages,
      warranty: `${getRandomItem([12, 24, 36])} months`
    };

    products.push(product);
    productDetails[id] = productDetail;
  }

  return { products, productDetails };
}

function generateAuxiliaryData() {
  const users = [
    {
      id: 'usr-001',
      username: 'geekup_tester',
      name: 'GEEK UP Candidate',
      email: 'candidate@geekup.vn',
      avatar: 'https://placehold.co/150x150?text=User+Avatar',
      role: 'Tester'
    },
    {
      id: 'usr-002',
      username: 'admin',
      name: 'System Administrator',
      email: 'admin@geekup.vn',
      avatar: 'https://placehold.co/150x150?text=Admin',
      role: 'Admin'
    }
  ];

  const loginSuccess = {
    success: true,
    message: 'Login successful',
    data: {
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-payload-geekup.signature',
      user: users[0]
    }
  };

  const loginFailed = {
    success: false,
    message: 'Invalid username or password'
  };

  const logout = {
    success: true,
    message: 'Logged out successfully'
  };

  return { users, loginSuccess, loginFailed, logout };
}

// ==========================================
// MAIN FILE WRITER EXECUTOR
// ==========================================

function main() {
  const outputDir = process.cwd();
  const { products, productDetails } = generateDataset();
  const { users, loginSuccess, loginFailed, logout } = generateAuxiliaryData();

  const productsResponse = {
    success: true,
    message: 'Products fetched successfully',
    data: products
  };

  fs.writeFileSync(path.join(outputDir, 'products.json'), JSON.stringify(productsResponse, null, 2), 'utf8');
  fs.writeFileSync(path.join(outputDir, 'product-details.json'), JSON.stringify(productDetails, null, 2), 'utf8');
  fs.writeFileSync(path.join(outputDir, 'users.json'), JSON.stringify(users, null, 2), 'utf8');
  fs.writeFileSync(path.join(outputDir, 'login-success.json'), JSON.stringify(loginSuccess, null, 2), 'utf8');
  fs.writeFileSync(path.join(outputDir, 'login-failed.json'), JSON.stringify(loginFailed, null, 2), 'utf8');
  fs.writeFileSync(path.join(outputDir, 'logout.json'), JSON.stringify(logout, null, 2), 'utf8');

  console.log('Generated successfully!');
}

main();