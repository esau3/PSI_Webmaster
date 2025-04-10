import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteDetailComponent } from './website-detail.component';

describe('WebsiteDetailComponent', () => {
  let component: WebsiteDetailComponent;
  let fixture: ComponentFixture<WebsiteDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsiteDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WebsiteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
