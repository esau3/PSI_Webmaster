
import { Component,HostListener,Renderer2, ElementRef, OnInit } from '@angular/core';

@Component({
  template: ''
})
export class arrowComponent{
selectedIndex = 0;
  items:NodeListOf<Element>|undefined;

  constructor(private renderer: Renderer2, private elRef: ElementRef) {}
  
  ngOnInit(){
    this.items= this.elRef.nativeElement.querySelectorAll('.focus');
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if(this.items){
    if (event.key === 'ArrowUp') {
      //event.preventDefault(); // Evita o comportamento padrão de mover o cursor de texto para cima
      this.selectedIndex = Math.max(0, this.selectedIndex - 1);
      console.log("hello")
    } else if (event.key === 'ArrowDown') {
      //event.preventDefault(); // Evita o comportamento padrão de mover o cursor de texto para baixo
      this.selectedIndex = Math.min(this.items.length - 1, this.selectedIndex + 1);
    }
    (this.items[this.selectedIndex] as HTMLElement).focus();
    }
    }
    
  }