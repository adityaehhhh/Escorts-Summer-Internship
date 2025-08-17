import React, { useState } from 'react';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';
import './Generator.css';

const TractorQRGen = () => {
  const [formData, setFormData] = useState({
    tractorId: '',
    tractorName: '',
    issueDate: '',
    expireDate: '',
    issuedTo: '',
    place: '',
    time: ''
  });
  const [qrValue, setQRValue] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateQRCode = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/tractors', formData);
      setQRValue(response.data.barcodeValue);
      setError('');
    } catch (err) {
      setError('Failed to save data: ' + (err.response?.data?.error || err.message));
    }
  };

  const isFormComplete = Object.values(formData).every(value => value.trim() !== '');

  return (
    <div className="tractor-barcode-gen">  
      <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-green-700 mb-6">Tractor QR Code Generator</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <div className="space-y-4">
            <input
              type="text"
              name="tractorId"
              value={formData.tractorId}
              onChange={handleInputChange}
              placeholder="Tractor ID"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              name="tractorName"
              value={formData.tractorName}
              onChange={handleInputChange}
              placeholder="Tractor Name"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="date"
              name="expireDate"
              value={formData.expireDate}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              name="issuedTo"
              value={formData.issuedTo}
              onChange={handleInputChange}
              placeholder="Issued To"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              name="place"
              value={formData.place}
              onChange={handleInputChange}
              placeholder="Place"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={generateQRCode}
              disabled={!isFormComplete}
              className={`w-full p-2 rounded text-white font-semibold transition-colors duration-300 ${
                isFormComplete ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Generate QR Code
            </button>
          </div>
          {qrValue && (
            <div className="mt-6 flex justify-center">
              <div className="qr-code">
                <QRCodeCanvas value={qrValue} size={150} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div> 
  );
};

export default TractorQRGen;
