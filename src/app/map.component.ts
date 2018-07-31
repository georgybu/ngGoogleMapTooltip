import {
  Component,
  ComponentFactoryResolver, OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {} from '@types/googlemaps';
import {MapTooltipComponent} from './map-tooltip.component';

@Component({
  selector: 'app-map',
  template: `
    <div #gmap class="google-map-container"></div>
  `,
  styles: []
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild('gmap') gmapElement: any;

  private map: google.maps.Map;
  private marker: google.maps.Marker;
  private dynamicComponents = [];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef) {
  }

  ngOnInit() {
    const center = new google.maps.LatLng(43.311466, 12.471009);
    const mapProp = {center, zoom: 20, mapTypeId: google.maps.MapTypeId.SATELLITE};
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.marker = new google.maps.Marker({position: center, draggable: false, map: this.map});

    this.marker.addListener('click', () => {
      if (!(<any>this.marker).infoWindow) {
        const content = this.getTooltipContent({
          hello: 'world',
          isFavorite: true
        });

        const infoWindow = new google.maps.InfoWindow({content});
        infoWindow.open(this.map, this.marker);
        infoWindow.addListener('closeclick', () => {
          (<any>this.marker).infoWindow = null;
        });

        (<any>this.marker).infoWindow = infoWindow;
      }
    });
  }

  ngOnDestroy() {
    this.dynamicComponents.forEach((componentRef) => {
      if (componentRef) {
        componentRef.destroy();
        componentRef = null;
      }
    });
  }

  private getTooltipContent(data: any): HTMLElement {
    const content: HTMLElement = document.createElement('div');
    const factory = this.componentFactoryResolver.resolveComponentFactory(MapTooltipComponent);
    const componentRef = this.viewContainerRef.createComponent(factory);
    (<MapTooltipComponent>componentRef.instance).metaData = data;
    componentRef.changeDetectorRef.detectChanges();
    this.dynamicComponents.push(componentRef);
    content.appendChild(componentRef.injector.get(MapTooltipComponent).elRef.nativeElement);
    return content;
  }

}
