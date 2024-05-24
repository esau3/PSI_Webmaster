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
      
      // Obtemos a altura total do elemento, incluindo seu conteúdo e margens
      const elementHeight = element.getBoundingClientRect().height;

      // Limitamos a altura do elemento para a altura da página
      element.style.height = '100%';

      const canvas = await html2canvas(element, { scale: 2, useCORS: true }); // Ajustamos a escala e habilitamos o uso de CORS
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const contentDataURL = canvas.toDataURL('image/jpeg', 0.7); // Ajustamos a qualidade da imagem

      if (i > 0) {
        pdf.addPage(); // Adicionamos uma nova página para todos os elementos, exceto o primeiro
      }
      
      if (yOffset + imgHeight > pageHeight) {
        yOffset = 0; // Resetamos o deslocamento quando adicionamos uma nova página
        pdf.addPage();
      }

      pdf.addImage(contentDataURL, 'JPEG', 0, yOffset, imgWidth, imgHeight);
      yOffset += imgHeight;
    }

    pdf.save(fileName);
  }
}
