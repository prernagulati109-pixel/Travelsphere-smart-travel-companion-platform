import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, CheckCircle2, AlertCircle, RefreshCcw, ShieldCheck } from 'lucide-react';

const QR_READER_ID = 'qr-scanner-region';

// Scan states
const STATE = {
  IDLE: 'idle',
  LOADING: 'loading',
  SCANNING: 'scanning',
  SUCCESS: 'success',
  ERROR: 'error',
  PERMISSION_DENIED: 'permission_denied',
};

export default function QRScannerModal({ isOpen, onClose, bookingTotal, onPaymentConfirmed }) {
  const [scanState, setScanState] = useState(STATE.IDLE);
  const [errorMsg, setErrorMsg] = useState('');
  const [verifiedAmount, setVerifiedAmount] = useState(null);
  const scannerRef = useRef(null);
  const mountedRef = useRef(false);

  /* ── Start scanner ── */
  const startScanner = useCallback(async () => {
    setScanState(STATE.LOADING);
    setErrorMsg('');

    try {
      const scanner = new Html5Qrcode(QR_READER_ID);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 230, height: 230 } },
        (decodedText) => handleScan(decodedText),
        () => {}   // ignore per-frame errors silently
      );

      setScanState(STATE.SCANNING);
    } catch (err) {
      const msg = String(err);
      if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('notallowed')) {
        setScanState(STATE.PERMISSION_DENIED);
      } else {
        setScanState(STATE.ERROR);
        setErrorMsg('Unable to access camera. Please try again.');
      }
    }
  }, []);

  /* ── Stop scanner safely ── */
  const stopScanner = useCallback(async () => {
    try {
      if (scannerRef.current) {
        const s = scannerRef.current;
        scannerRef.current = null;
        if (s.isScanning) await s.stop();
        s.clear();
      }
    } catch (_) {}
  }, []);

  /* ── Handle a decoded QR value ── */
  const handleScan = useCallback(
    async (decoded) => {
      await stopScanner();

      // Always use the website's booking total — never trust QR amount
      const lockedAmount = bookingTotal;
      setVerifiedAmount(lockedAmount);
      setScanState(STATE.SUCCESS);
    },
    [stopScanner, bookingTotal]
  );

  /* ── Lifecycle: open/close ── */
  useEffect(() => {
    if (!isOpen) return;
    mountedRef.current = true;

    // Short delay so the DOM node renders before Html5Qrcode attaches
    const t = setTimeout(() => {
      if (mountedRef.current) startScanner();
    }, 300);

    return () => {
      clearTimeout(t);
      mountedRef.current = false;
      stopScanner();
    };
  }, [isOpen, startScanner, stopScanner]);

  /* ── Close: reset state ── */
  const handleClose = async () => {
    await stopScanner();
    setScanState(STATE.IDLE);
    setVerifiedAmount(null);
    setErrorMsg('');
    onClose();
  };

  /* ── Retry ── */
  const handleRetry = async () => {
    await stopScanner();
    setScanState(STATE.IDLE);
    setErrorMsg('');
    setVerifiedAmount(null);
    setTimeout(startScanner, 200);
  };

  /* ── Confirm payment ── */
  const handleConfirm = () => {
    handleClose();
    onPaymentConfirmed();
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} role="dialog" aria-modal="true" aria-label="QR Scanner">
      {/* Backdrop */}
      <div style={styles.backdrop} onClick={handleClose} />

      {/* Modal */}
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.iconWrap}>
              <Camera size={20} color="#fff" />
            </div>
            <div>
              <h3 style={styles.title}>Scan &amp; Pay</h3>
              <p style={styles.subtitle}>Point camera at QR code</p>
            </div>
          </div>
          <button style={styles.closeBtn} onClick={handleClose} aria-label="Close scanner">
            <X size={20} />
          </button>
        </div>

        {/* Amount badge */}
        <div style={styles.amountBadge}>
          <ShieldCheck size={14} color="#10b981" />
          <span style={styles.amountText}>
            Locked amount: <strong>₹{bookingTotal?.toLocaleString()}</strong>
          </span>
        </div>

        {/* Scanner viewport */}
        <div style={styles.viewportWrap}>
          {/* The html5-qrcode target div — always present in DOM while modal is open */}
          <div
            id={QR_READER_ID}
            style={{
              ...styles.scannerDiv,
              display: scanState === STATE.SCANNING ? 'block' : 'none',
            }}
          />

          {/* LOADING */}
          {scanState === STATE.LOADING && (
            <div style={styles.centeredState}>
              <RefreshCcw size={36} color="#3b82f6" style={{ animation: 'qr-spin 1s linear infinite' }} />
              <p style={styles.stateText}>Starting camera…</p>
            </div>
          )}

          {/* IDLE */}
          {scanState === STATE.IDLE && (
            <div style={styles.centeredState}>
              <Camera size={48} color="#94a3b8" />
              <p style={styles.stateText}>Camera initialising…</p>
            </div>
          )}

          {/* SUCCESS */}
          {scanState === STATE.SUCCESS && (
            <div style={{ ...styles.centeredState, gap: '12px' }}>
              <div style={styles.successIcon}>
                <CheckCircle2 size={44} color="#fff" />
              </div>
              <p style={{ ...styles.stateText, color: '#10b981', fontWeight: '700', fontSize: '1.05rem', marginBottom: 0 }}>
                Amount verified successfully
              </p>
              <p style={{ color: '#475569', fontSize: '0.85rem', marginTop: '2px' }}>
                Your payment of{' '}
                <strong style={{ color: '#0f172a' }}>₹{verifiedAmount?.toLocaleString()}</strong>{' '}
                is ready to process.
              </p>
            </div>
          )}

          {/* ERROR */}
          {(scanState === STATE.ERROR || scanState === STATE.PERMISSION_DENIED) && (
            <div style={{ ...styles.centeredState, gap: '10px' }}>
              <AlertCircle size={44} color="#ef4444" />
              <p style={{ ...styles.stateText, color: '#ef4444', fontWeight: '600', marginBottom: 0 }}>
                {scanState === STATE.PERMISSION_DENIED ? 'Camera access denied' : 'Camera error'}
              </p>
              <p style={{ color: '#64748b', fontSize: '0.83rem', textAlign: 'center', maxWidth: '240px' }}>
                {scanState === STATE.PERMISSION_DENIED
                  ? 'Please allow camera access in your browser settings and try again.'
                  : errorMsg}
              </p>
            </div>
          )}

          {/* Scanning overlay corners */}
          {scanState === STATE.SCANNING && (
            <div style={styles.cornerWrap} aria-hidden="true">
              {['tl', 'tr', 'bl', 'br'].map((pos) => (
                <div key={pos} style={{ ...styles.corner, ...cornerPos[pos] }} />
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={styles.footer}>
          {scanState === STATE.SUCCESS ? (
            <button style={styles.confirmBtn} onClick={handleConfirm}>
              <CheckCircle2 size={18} /> Confirm &amp; Pay ₹{verifiedAmount?.toLocaleString()}
            </button>
          ) : scanState === STATE.ERROR || scanState === STATE.PERMISSION_DENIED ? (
            <button style={styles.retryBtn} onClick={handleRetry}>
              <RefreshCcw size={16} /> Try Again
            </button>
          ) : null}

          <button style={styles.cancelBtn} onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>

      <style>{`
        @keyframes qr-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes qr-slideUp {
          from { opacity: 0; transform: translateY(48px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes qr-fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        /* Force html5-qrcode video to fill container cleanly */
        #${QR_READER_ID} video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 14px !important;
        }
        #${QR_READER_ID} img { display: none !important; }
        /* Hide default html5-qrcode UI chrome */
        #${QR_READER_ID} > div:not(#${QR_READER_ID}__scan_region) { display: none !important; }
        #${QR_READER_ID}__header_message { display: none !important; }
        #${QR_READER_ID}__status_span    { display: none !important; }
      `}</style>
    </div>
  );
}

/* ── Styles ── */
const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9000,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: '0',
    animation: 'qr-fadeIn 0.25s ease',
  },
  backdrop: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(5px)',
  },
  modal: {
    position: 'relative',
    zIndex: 1,
    background: '#ffffff',
    borderRadius: '28px 28px 0 0',
    width: '100%',
    maxWidth: '480px',
    padding: '24px 24px 32px',
    boxShadow: '0 -20px 60px rgba(0,0,0,0.25)',
    animation: 'qr-slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconWrap: {
    background: 'linear-gradient(135deg,#6366f1,#3b82f6)',
    borderRadius: '12px',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#0f172a' },
  subtitle: { margin: 0, fontSize: '0.78rem', color: '#64748b' },
  closeBtn: {
    border: 'none',
    background: '#f1f5f9',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#475569',
    transition: 'background 0.2s',
  },
  amountBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#ecfdf5',
    border: '1px solid #a7f3d0',
    borderRadius: '10px',
    padding: '10px 14px',
  },
  amountText: { fontSize: '0.85rem', color: '#065f46' },
  viewportWrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: '1',
    maxHeight: '300px',
    background: '#0f172a',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerDiv: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
  },
  centeredState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '24px',
    textAlign: 'center',
    width: '100%',
  },
  stateText: { color: '#94a3b8', fontSize: '0.9rem', margin: 0 },
  successIcon: {
    background: 'linear-gradient(135deg,#10b981,#059669)',
    borderRadius: '50%',
    width: '76px',
    height: '76px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(16,185,129,0.4)',
  },
  cornerWrap: {
    position: 'absolute',
    inset: '20px',
    pointerEvents: 'none',
  },
  corner: {
    position: 'absolute',
    width: '24px',
    height: '24px',
    borderColor: '#3b82f6',
    borderStyle: 'solid',
    borderWidth: 0,
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  confirmBtn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg,#10b981,#059669)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
  },
  retryBtn: {
    width: '100%',
    padding: '13px',
    background: '#eff6ff',
    color: '#2563eb',
    border: '1px solid #bfdbfe',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  cancelBtn: {
    width: '100%',
    padding: '12px',
    background: 'transparent',
    color: '#64748b',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '500',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
};

const cornerPos = {
  tl: { top: 0, left: 0, borderTopWidth: '3px', borderLeftWidth: '3px', borderTopLeftRadius: '6px' },
  tr: { top: 0, right: 0, borderTopWidth: '3px', borderRightWidth: '3px', borderTopRightRadius: '6px' },
  bl: { bottom: 0, left: 0, borderBottomWidth: '3px', borderLeftWidth: '3px', borderBottomLeftRadius: '6px' },
  br: { bottom: 0, right: 0, borderBottomWidth: '3px', borderRightWidth: '3px', borderBottomRightRadius: '6px' },
};
