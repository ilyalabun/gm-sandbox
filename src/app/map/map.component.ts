/// <reference types="@types/googlemaps" />

import {Component, Inject, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';

import { DOCUMENT } from '@angular/common';


declare var MarkerClusterer: any;


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {

  @ViewChild('gmap', {static: false}) gmapElement: any;
  @ViewChild('infowindowtmpl', {static: false}) infoWindowTmpl: TemplateRef<any>;
  mapHidden = false;

  constructor(@Inject(DOCUMENT) private document: Document) { };

  ngAfterViewInit(){

    var map = new google.maps.Map(this.gmapElement.nativeElement, {
      zoom: 3,
      center: {lat: -28.024, lng: 140.887}
    });


    let component = this;

    google.maps.event.addListenerOnce(map, 'idle', function () {
      // Create an array of alphabetical characters used to label the markers.
      var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

      // Add some markers to the map.
      // create an array of markers based on a given "locations" array.
      // Note: The code uses the JavaScript Array.prototype.map() method to
      var locations = [
        {lat: -31.563910, lng: 147.154312},
        {lat: -33.718234, lng: 150.363181},
        {lat: -33.727111, lng: 150.371124},
        {lat: -33.848588, lng: 151.209834},
        {lat: -33.851702, lng: 151.216968},
        {lat: -34.671264, lng: 150.863657},
        {lat: -35.304724, lng: 148.662905},
        {lat: -36.817685, lng: 175.699196},
        {lat: -36.828611, lng: 175.790222},
        {lat: -37.750000, lng: 145.116667},
        {lat: -37.759859, lng: 145.128708},
        {lat: -37.765015, lng: 145.133858},
        {lat: -37.770104, lng: 145.143299},
        {lat: -37.773700, lng: 145.145187},
        {lat: -37.774785, lng: 145.137978},
        {lat: -37.819616, lng: 144.968119},
        {lat: -38.330766, lng: 144.695692},
        {lat: -39.927193, lng: 175.053218},
        {lat: -41.330162, lng: 174.865694},
        {lat: -42.734358, lng: 147.439506},
        {lat: -42.734358, lng: 147.501315},
        {lat: -42.735258, lng: 147.438000},
        {lat: -43.999792, lng: 170.463352}
      ];

      var curInfo = null;
      var curMarker = null;

      var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

      var markers = locations.map(function(location, i) {
        let embeddedViewRef = component.infoWindowTmpl.createEmbeddedView({
          lat: location.lat,
          lng: location.lng
        });

        let rootNode = embeddedViewRef.rootNodes[0];
        rootNode.getElementsByClassName('hide_map').item(0).addEventListener('click', function () {
          console.log('click');
          component.mapHidden = true;
        });
        var infowindow = new google.maps.InfoWindow({
          content: rootNode
        });

        let marker = new google.maps.Marker({
          position: location,
          label: labels[i % labels.length],
          icon: iconBase + 'parking_lot_maps.png',
        });

        marker.addListener('click', function() {
          if (curInfo) {
            curInfo.close();
          }

          if (curMarker) {
            curMarker.setIcon(iconBase + 'parking_lot_maps.png');
          }
          marker.setIcon(iconBase + 'bus.png');
          infowindow.open(map, marker);
          curInfo = infowindow;
          curMarker = marker;
        });

        infowindow.addListener('closeclick', function() {
          if (curInfo) {
            curInfo.close();
          }

          if (curMarker) {
            curMarker.setIcon(iconBase + 'parking_lot_maps.png');
          }
        });

        return marker;
      });

      // Add a marker clusterer to manage the markers.
      var markerCluster = new MarkerClusterer(map, markers,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    });
  }

}
