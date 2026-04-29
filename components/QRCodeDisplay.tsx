"use client";

import { QRCodeSVG } from "qrcode.react";

export default function QRCodeDisplay({ value, shortCode }: { value: string; shortCode: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="p-3 bg-white border border-gray-200 rounded-xl">
        <QRCodeSVG value={value} size={200} level="M" />
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1">or enter manually</p>
        <p className="text-4xl font-bold tracking-widest">{shortCode}</p>
      </div>
    </div>
  );
}
