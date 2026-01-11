'use client';

interface QRCodeModalProps {
  qrCode: string;
  routeName: string;
  onClose: () => void;
}

export default function QRCodeModal({ qrCode, routeName, onClose }: QRCodeModalProps) {
  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = `qr-${routeName.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4 text-gray-900">QR Code - {routeName}</h3>
        <div className="flex justify-center mb-4">
          <img src={qrCode} alt="QR Code" className="border-2 border-gray-300 rounded" />
        </div>
        <div className="flex gap-3">
          <button
            onClick={downloadQRCode}
            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Download QR Code
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
