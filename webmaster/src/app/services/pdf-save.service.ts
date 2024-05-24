import { Injectable } from '@angular/core';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfSaveService {

  constructor() { }

  async generatePDF(fileName: string) {

    const elements: any = document.getElementsByClassName('pdf_content');
    
    html2canvas(elements, {scale: 2}).then((canvas) => {

      const pdf = new jspdf();

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298);

      pdf.setProperties({
        title: "ALOOO",
        subject: "QualWeb Report",
        author: "Grupo 42"
      })

      pdf.save(fileName + ".pdf");
    }
  ) 

  
  }
}
