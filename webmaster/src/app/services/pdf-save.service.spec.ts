import { TestBed } from '@angular/core/testing';

import { PdfSaveService } from './pdf-save.service';

describe('PdfSaveService', () => {
  let service: PdfSaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfSaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
