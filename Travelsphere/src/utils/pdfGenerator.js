import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const pdfGenerator = {
  /**
   * Generates a PDF for a travel itinerary
   * @param {Object} data - { destination, days, travelers, itinerary }
   */
  generateItineraryPDF: (data) => {
    const { destination, days, travelers, itinerary } = data;
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(31, 41, 55); // Dark blue-grey
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('TRAVELSPHERE', 15, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Your Smart Travel Itinerary', 15, 30);
    
    // Trip Summary
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`Trip to ${destination}`, 15, 55);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Duration: ${days} Days`, 15, 65);
    doc.text(`Travelers: ${travelers}`, 15, 72);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 79);
    
    let currentY = 90;
    
    itinerary.forEach((day) => {
      // Check for page overflow
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }
      
      // Day Header
      doc.setFillColor(243, 244, 246);
      doc.rect(15, currentY, 180, 10, 'F');
      doc.setTextColor(31, 41, 55);
      doc.setFont('helvetica', 'bold');
      doc.text(`Day ${day.day}: ${day.title}`, 20, currentY + 7);
      
      currentY += 15;
      
      // Activities Table
      const tableData = day.activities.map(act => [act.time, act.title, act.description]);
      
      doc.autoTable({
        startY: currentY,
        head: [['Time', 'Activity', 'Description']],
        body: tableData,
        margin: { left: 15, right: 15 },
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [75, 85, 99] },
        theme: 'striped',
        didDrawPage: (data) => {
          currentY = data.cursor.y;
        }
      });
      
      currentY += 10;
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
      doc.text('© 2026 Travelsphere. All rights reserved.', 105, 285, { align: 'center' });
    }
    
    doc.save(`${destination}_Itinerary_Travelsphere.pdf`);
  },

  /**
   * Generates a PDF for hotel booking details
   * @param {Object} hotel - Hotel object
   * @param {Object} bookingData - Booking details
   * @param {Number|String} totalPrice - Total calculated price
   */
  generateBookingPDF: (hotel, bookingData, totalPrice) => {
    const doc = new jsPDF();
    
    // Header (Blue Theme)
    doc.setFillColor(37, 99, 235); 
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('TRAVELSPHERE', 15, 20);
    doc.setFontSize(10);
    doc.text('Hotel Booking Confirmation', 15, 30);
    
    // Hotel Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text(hotel.name, 15, 55);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(hotel.location, 15, 62);
    
    // Booking Table
    doc.autoTable({
      startY: 75,
      head: [['Booking Detail', 'Information']],
      body: [
        ['Check-in Date', bookingData.checkIn],
        ['Check-out Date', bookingData.checkOut],
        ['Guests', bookingData.guests],
        ['Room Type', bookingData.roomType.toUpperCase()],
        ['Bed Type', bookingData.bedType.toUpperCase()],
        ['Total Price', `Rs. ${totalPrice ? totalPrice.toLocaleString() : hotel.price}`],
        ['Booking Status', 'CONFIRMED'],
      ],
      headStyles: { fillColor: [37, 99, 235] },
      styles: { cellPadding: 5 },
      theme: 'grid'
    });
    
    let finalY = doc.lastAutoTable.finalY + 20;
    
    // Important Notes
    doc.setFont('helvetica', 'bold');
    doc.text('Important Information:', 15, finalY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('• Please carry a valid Photo ID proof at the time of check-in.', 15, finalY + 10);
    doc.text('• Check-in time is usually 12:00 PM and Check-out is 11:00 AM.', 15, finalY + 17);
    doc.text('• For any queries, contact Travelsphere Support: +1-800-TRAVEL', 15, finalY + 24);
    
    doc.save(`Booking_${hotel.name.replace(/\s+/g, '_')}.pdf`);
  }
};
