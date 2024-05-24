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
    const promises: Promise<HTMLCanvasElement>[] = [];

    for (let i = 0; i < elements.length; i++) {
      promises.push(
        new Promise((resolve, reject) => {
          html2canvas(elements[i], { scale: 2 }).then((canvas) => {
            resolve(canvas);
          }).catch(error => {
            reject(error);
          });
        })
      );
    }

    Promise.all(promises).then((canvases) => {
      const pdf = new jspdf();

      canvases.forEach((canvas, index) => {
        if (index !== 0) {
          pdf.addPage(); // Adiciona uma nova página para os elementos subsequentes
        }

        //medidas exatas dos detalhes do website
        if (index == 0) { 
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 304 / 3, 764.4 / 3);
        } else {
        //para ter o tamanho
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 450 / 2 , (171 * (index + 1)));
        }
      });

      pdf.setProperties({
        title: fileName + ".pdf",
        subject: "QualWeb Report",
        author: "Grupo 42"
      });

      pdf.save(fileName + ".pdf");
    }).catch(error => {
      console.error('Erro ao gerar o PDF:', error);
    });
  }
}
