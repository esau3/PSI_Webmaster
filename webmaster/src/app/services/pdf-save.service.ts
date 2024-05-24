import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfSaveService {

  constructor() { }

  async generatePDF(fileName: string) {
    const elements = document.getElementsByClassName('pdf_content');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 208;
    const pageHeight = 295;
    let yOffset = 0;

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLElement;

      const elementHeight = element.getBoundingClientRect().height;
      const numPages = Math.ceil(elementHeight / pageHeight);

      for (let pageNum = 0; pageNum < numPages; pageNum++) {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          windowHeight: pageHeight,
          y: -pageNum * pageHeight
        });

        const imgHeight = canvas.height * imgWidth / canvas.width;
        const contentDataURL = canvas.toDataURL('image/jpeg', 0.7);

        if (pageNum > 0) {
          pdf.addPage();
        }

        if (yOffset + imgHeight > pageHeight) {
          yOffset = 0;
          pdf.addPage();
        }

        pdf.addImage(contentDataURL, 'JPEG', 0, yOffset, imgWidth, imgHeight);
        yOffset += imgHeight;
      }
    }

    pdf.save(fileName);
  }
}
