import React from 'react';

export function ContactMap() {
  // Default location coordinates (can be customized)
  const latitude = 56.9496; // Riga, Latvia
  const longitude = 24.1052;
  
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`;
  
  return (
    <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden border border-gray-600">
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Company Location Map"
        className="rounded-lg"
      />
    </div>
  );
}

export default ContactMap;