import { Component, ViewChild } from '@angular/core';

import { NavController, Platform} from 'ionic-angular';

import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng, CameraPosition } from 'ionic-native';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  map: GoogleMap;

  constructor(public navCtrl: NavController, public platform: Platform) {
    // // platform.ready().then(() => {
    //         this.loadMap();
    //     // });
  }

  ionViewDidEnter(){
      let env = this;
      let location = new GoogleMapsLatLng(-34.9290,138.6010);

        this.map = new GoogleMap('map', {
          'backgroundColor': 'white',
          'controls': {
            'compass': true,
            'myLocationButton': true,
            'indoorPicker': true,
            'zoom': true
          },
          'gestures': {
            'scroll': true,
            'tilt': true,
            'rotate': true,
            'zoom': true
          },
          'camera': {
            'latLng': location,
            'tilt': 30,
            'zoom': 15,
            'bearing': 50
          }
        });

        this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
            console.log('Map is ready!');
            env.map.getMyLocation()
            .then(function(result) {
              let position: CameraPosition = {
                target: result.latLng,
                zoom: 18,
                tilt: 30
              }
              env.map.moveCamera(position);
            }, function (error) {
                console.log(error);
            })

        });
  }
}
