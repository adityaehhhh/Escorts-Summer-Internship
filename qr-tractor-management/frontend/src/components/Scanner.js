import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Html5Qrcode } from 'html5-qrcode';
import './Scanner.css';

const TractorQRScanner = () => {
  const [tractorDetails, setTractorDetails] = useState(null);
  const [error, setError] = useState('');
  const html5QrCodeRef = useRef(null);

  const fetchTractorDetails = async (tractorId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tractors/${tractorId}`);
      setTractorDetails(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch tractor details.');
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!html5QrCodeRef.current) {
      html5QrCodeRef.current = new Html5Qrcode('scanner');
    }

    try {
      const result = await html5QrCodeRef.current.scanFile(file, true);
      const tractorId = result.split('|')[0];
      fetchTractorDetails(tractorId);
      setError('');
    } catch (err) {
      console.error('Image scan failed:', err);
      setError('No QR code detected in the uploaded image. Please try another image.');
    }
  };

  const startCameraScan = () => {
    if (!html5QrCodeRef.current) {
      html5QrCodeRef.current = new Html5Qrcode('scanner');
    }

    html5QrCodeRef.current.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        const tractorId = decodedText.split('|')[0];
        fetchTractorDetails(tractorId);
        html5QrCodeRef.current.stop().catch(console.error);
      },
      (errorMsg) => {
        console.warn('QR code scan error', errorMsg);
      }
    ).catch(err => {
      console.error('Unable to start scanner', err);
      setError('Unable to access camera.');
    });
  };

  return (
    <div className="tractor-qr-scanner">
      <h2>Scan or Upload Tractor QR Code</h2>

      <div className="scanner-options">
        <button onClick={startCameraScan} className="scan-btn">Start Camera Scan</button>

        <h3>Or Upload QR Image</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setError('');
            handleImageUpload(e);
          }}
        />
      </div>

      <div id="scanner" style={{ width: '100%', marginTop: '16px' }}></div>

      {error && <p className="error">{error}</p>}

      {tractorDetails && (
        <div className="tractor-details">
          <p><strong>Tractor ID:</strong> {tractorDetails.tractorId}</p>
          <h2>{tractorDetails.tractorName}</h2>

          <div className="dates-row">
            <p><strong>Issue Date:</strong> {tractorDetails.issueDate}</p>
            <p><strong>Expire Date:</strong> {tractorDetails.expireDate}</p>
          </div>

          <div className="info-row">
            <p><strong>Issued To:</strong> {tractorDetails.issuedTo}</p>
            <p><strong>Place:</strong> {tractorDetails.place}</p>
            <p><strong>Time:</strong> {tractorDetails.time}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TractorQRScanner;
