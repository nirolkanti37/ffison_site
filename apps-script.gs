// ==========================================
// Google Apps Script - Sheets to GitHub Sync
// ==========================================

const CONFIG = {
  GITHUB_TOKEN: PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN'),
  GITHUB_OWNER: 'YOUR_GITHUB_USERNAME',  // Change this!
  GITHUB_REPO: 'github-sheets-shop',      // Change this!
  GITHUB_BRANCH: 'main',
  DATA_PATH: 'data/'
};

// ==========================================
// TRIGGER SETUP
// ==========================================

function createTriggers() {
  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(t => ScriptApp.deleteTrigger(t));

  // onEdit trigger for real-time sync
  const ss = SpreadsheetApp.getActive();
  ScriptApp.newTrigger('onEditHandler')
    .forSpreadsheet(ss)
    .onEdit()
    .create();

  // Hourly backup trigger
  ScriptApp.newTrigger('backupAllSheets')
    .timeBased()
    .everyHours(1)
    .create();

  Logger.log('Triggers created successfully!');
}

function onEditHandler(e) {
  const sheet = e.source.getActiveSheet();
  const sheetName = sheet.getName();

  const syncSheets = ['Settings', 'Products', 'Categories', 'Coupons', 'Shipping', 'Pages'];

  if (syncSheets.includes(sheetName)) {
    syncSheetToGitHub(sheetName);
  }
}

// ==========================================
// SYNC FUNCTIONS
// ==========================================

function syncSheetToGitHub(sheetName) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      Logger.log('Sheet not found: ' + sheetName);
      return;
    }

    const data = sheetToJSON(sheet);
    const fileName = sheetName.toLowerCase().replace(/\s+/g, '_') + '.json';
    const content = JSON.stringify(data, null, 2);

    commitToGitHub(fileName, content, `Update ${sheetName} from Google Sheets`);
    Logger.log(`Synced: ${sheetName} → ${fileName}`);

  } catch (e) {
    Logger.log('Error syncing ' + sheetName + ': ' + e.message);
  }
}

function sheetToJSON(sheet) {
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();

  if (values.length < 2) return [];

  const headers = values[0].map(h => String(h).trim());
  const rows = [];

  for (let i = 1; i < values.length; i++) {
    const row = {};
    let hasData = false;

    for (let j = 0; j < headers.length; j++) {
      let value = values[i][j];
      const key = headers[j];

      // Skip empty rows
      if (value !== '' && value !== null && value !== undefined) {
        hasData = true;
      }

      // Parse JSON strings
      if (typeof value === 'string') {
        value = value.trim();
        if ((value.startsWith('[') && value.endsWith(']')) || 
            (value.startsWith('{') && value.endsWith('}'))) {
          try {
            value = JSON.parse(value);
          } catch (e) {
            // Keep as string
          }
        }
      }

      // Parse numbers
      if (typeof value === 'string' && !isNaN(value) && value !== '') {
        if (value.includes('.')) {
          value = parseFloat(value);
        } else {
          value = parseInt(value);
        }
      }

      // Parse booleans
      if (value === 'true') value = true;
      if (value === 'false') value = false;

      row[key] = value;
    }

    if (hasData) {
      rows.push(row);
    }
  }

  return rows;
}

// ==========================================
// GITHUB API
// ==========================================

function commitToGitHub(fileName, content, message) {
  const url = `https://api.github.com/repos/${CONFIG.GITHUB_OWNER}/${CONFIG.GITHUB_REPO}/contents/${CONFIG.DATA_PATH}${fileName}`;

  // Get current file SHA
  let sha = null;
  try {
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `token ${CONFIG.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      muteHttpExceptions: true
    });

    if (response.getResponseCode() === 200) {
      const fileData = JSON.parse(response.getContentText());
      sha = fileData.sha;
    }
  } catch (e) {
    Logger.log('File does not exist, creating new: ' + fileName);
  }

  // Commit file
  const payload = {
    message: message,
    content: Utilities.base64Encode(content, Utilities.Charset.UTF_8),
    branch: CONFIG.GITHUB_BRANCH
  };

  if (sha) {
    payload.sha = sha;
  }

  const response = UrlFetchApp.fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${CONFIG.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  if (response.getResponseCode() === 200 || response.getResponseCode() === 201) {
    Logger.log('Successfully committed: ' + fileName);
  } else {
    Logger.log('Error: ' + response.getContentText());
    throw new Error('GitHub API error: ' + response.getResponseCode());
  }
}

// ==========================================
// BULK SYNC
// ==========================================

function syncAllSheets() {
  const sheets = ['Settings', 'Products', 'Categories', 'Coupons', 'Shipping', 'Pages'];

  sheets.forEach(sheetName => {
    syncSheetToGitHub(sheetName);
    Utilities.sleep(1000); // Rate limit protection
  });

  Logger.log('All sheets synced!');
}

function backupAllSheets() {
  syncAllSheets();
  Logger.log('Backup completed at: ' + new Date());
}

// ==========================================
// WEB APP - Order Handling
// ==========================================

function doPost(e) {
  const data = JSON.parse(e.postData.contents);

  if (data.action === 'place_order') {
    return handleOrder(data);
  }

  if (data.action === 'validate_coupon') {
    return validateCoupon(data.code, data.total);
  }

  return jsonResponse({ success: false, error: 'Unknown action' });
}

function doGet(e) {
  const action = e.parameter.action;

  if (action === 'get_products') {
    return getProducts(e.parameter);
  }

  return jsonResponse({ success: false, error: 'Unknown action' });
}

function handleOrder(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const ordersSheet = ss.getSheetByName('Orders');

    if (!ordersSheet) {
      return jsonResponse({ success: false, error: 'Orders sheet not found' });
    }

    const orderId = 'ORD-' + new Date().getFullYear() + '-' + 
      String(ordersSheet.getLastRow()).padStart(3, '0');

    ordersSheet.appendRow([
      orderId,
      data.customer.name,
      data.customer.email,
      data.customer.phone,
      JSON.stringify(data.items),
      data.subtotal,
      data.discount,
      data.shipping,
      data.total,
      'pending',
      data.payment_method,
      '',
      JSON.stringify(data.shipping_address),
      new Date().toISOString(),
      new Date().toISOString()
    ]);

    // Send email notification
    sendOrderEmail(orderId, data);

    return jsonResponse({ 
      success: true, 
      order_id: orderId,
      message: 'Order placed successfully'
    });

  } catch (e) {
    return jsonResponse({ success: false, error: e.message });
  }
}

function validateCoupon(code, total) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Coupons');
    const data = sheetToJSON(sheet);

    const coupon = data.find(c => c.code === code && c.status === 'active');

    if (!coupon) {
      return jsonResponse({ valid: false, message: 'Invalid coupon' });
    }

    if (total < (coupon.min_order || 0)) {
      return jsonResponse({ 
        valid: false, 
        message: `Minimum order $${coupon.min_order} required` 
      });
    }

    return jsonResponse({ 
      valid: true, 
      coupon: coupon,
      message: 'Coupon applied'
    });

  } catch (e) {
    return jsonResponse({ valid: false, error: e.message });
  }
}

function getProducts(params) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Products');
    let data = sheetToJSON(sheet);

    // Filter by category
    if (params.category) {
      data = data.filter(p => p.category === params.category);
    }

    // Filter by search
    if (params.q) {
      const q = params.q.toLowerCase();
      data = data.filter(p => 
        p.title.toLowerCase().includes(q)
      );
    }

    return jsonResponse({ success: true, products: data });

  } catch (e) {
    return jsonResponse({ success: false, error: e.message });
  }
}

function sendOrderEmail(orderId, data) {
  try {
    const subject = `New Order: ${orderId}`;
    const body = `
Order ID: ${orderId}
Customer: ${data.customer.name}
Email: ${data.customer.email}
Phone: ${data.customer.phone}
Total: $${data.total}

Items:
${data.items.map(i => `- ${i.title} x${i.qty} = $${(i.price * i.qty).toFixed(2)}`).join('\n')}

Address:
${data.shipping_address.address}
${data.shipping_address.city}, ${data.shipping_address.zip}
${data.shipping_address.country}
    `;

    MailApp.sendEmail({
      to: data.customer.email,
      subject: subject,
      body: body,
      name: 'My Shop'
    });

  } catch (e) {
    Logger.log('Email failed: ' + e.message);
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function testSync() {
  syncAllSheets();
}

function clearAllData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ['Orders', 'Customers'];

  sheets.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (sheet && sheet.getLastRow() > 1) {
      sheet.deleteRows(2, sheet.getLastRow() - 1);
    }
  });

  Logger.log('Cleared orders and customers data');
}
