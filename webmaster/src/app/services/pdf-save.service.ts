import { Injectable } from '@angular/core';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfSaveService {

  constructor() {}

  generatePDF(fileName: string) {

      const elements: any = document.getElementsByClassName('pdf_content');

      for (let i = 0; i < elements.length; i++) {
        
        html2canvas(elements[i], {scale: 2}).then((canvas) => {

          const pdf = new jspdf();

          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298);

          pdf.setProperties({
            title: fileName + ".pdf",
            subject: "QualWeb Report",
            author: "Grupo 42"
          })

          pdf.save(fileName + ".pdf");
        })
    }
  }
}
