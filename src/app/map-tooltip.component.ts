import {ChangeDetectorRef, Component, ElementRef, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-map-tooltip',
  template: `
    <p *ngIf="metaData?.isFavorite">this is my favorite tooltip</p>
    <pre>{{ metaData | json }}</pre>
    <!-- here I can use other angular components -->
  `,
  styles: []
})
export class MapTooltipComponent implements OnInit {

  @Input() metaData;

  constructor(public elRef: ElementRef, public changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
  }

}
