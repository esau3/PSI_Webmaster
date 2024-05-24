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
      const canvas = await html2canvas(element, { scale: 3 }); // Aumentando a escala para melhorar a qualidade
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');

      if (i > 0) {
        pdf.addPage(); // Adiciona uma nova página para todos os elementos, exceto o primeiro
      }
      
      if (yOffset + imgHeight > pageHeight) {
        yOffset = 0; // Reseta o deslocamento quando adicionamos uma nova página
        pdf.addPage();
      }

      pdf.addImage(contentDataURL, 'PNG', 0, yOffset, imgWidth, imgHeight);
      yOffset += imgHeight;
    }

    pdf.save(fileName);
  }
}
