import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import {CanColor, CanColorCtor, mixinColor} from '@angular/material/core';

/**
 * Example of use
 * Import ComponentLibraryModule in the desired module and just use the selector
 * <svg-viewer src="./assets/icons/icon.svg"></svg-viewer>
 *
 * Case you need a full container icon:
 * <svg-viewer src="./assets/icons/icon.svg" [scaleToContainer]="true"></svg-viewer>
 *
 *  * Case you need a theme color:
 * <svg-viewer src="./assets/icons/icon.svg" color="accent"></svg-viewer>
 * Also work with custom colors:
 * <svg-viewer src="./assets/icons/icon.svg" color="#C1C1C1"></svg-viewer>
 * <svg-viewer src="./assets/icons/icon.svg" color="red"></svg-viewer>
 */

@Component({
  selector: 'svg-viewer',
  template: '<div class="svg-viewer" aria-hidden="true"></div>',
  host: {'class': 'svg-viewer'},
})

export class SvgViewer implements OnInit {
  @Input() src: string;
  @Input() scaleToContainer: boolean;
  @Input() color: string;

  constructor(
    private elementRef: ElementRef,
    private http: HttpClient
    ) {}

  ngOnInit() {
    this.fetchAndInlineSvgContent(this.src);

    if (this.color !== 'primary' && this.color !== 'accent' && this.color !== null) {
      this.elementRef.nativeElement.style.color = this.color;
    }
  }

  private fetchAndInlineSvgContent(path: string): void {
    this.http.get(path, { responseType: 'text' }).subscribe(svgResponse => {
      this.setInlineSvg(svgResponse);
    });
  }

  private setInlineSvg(template: string) {
    this.elementRef.nativeElement.innerHTML = template;

    if (this.scaleToContainer) {
      const svg = this.elementRef.nativeElement.querySelector('svg');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    }
  }
}
