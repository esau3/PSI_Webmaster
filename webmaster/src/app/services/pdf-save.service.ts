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

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i] as HTMLElement;
        const canvas = await html2canvas(element);
        const imgWidth = 208;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');
        
        pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
      }
      
      pdf.save(fileName)
    }
  
}
