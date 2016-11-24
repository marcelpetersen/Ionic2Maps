import { Component, NgZone } from '@angular/core';

import { NavController, Platform} from 'ionic-angular';

import { GoogleMap, GoogleMapsEvent, GoogleMapsLatLng ,CameraPosition } from 'ionic-native';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  map: GoogleMap;
  autocomplete: any;
  GooglePlaces: any;
  geocoder: any
  autocompleteItems: any

  constructor(public navCtrl: NavController, public platform: Platform, public zone: NgZone) {
    this.geocoder = new google.maps.Geocoder;
    this.GooglePlaces = new google.maps.places.AutocompleteService();
    this.autocomplete = {
      input: ''
    };
    this.autocompleteItems = [];
  }

  ionViewDidEnter(){
      let env = this;
      //Set latitude and longitude of some place
      //let location = new GoogleMapsLatLng(-34.9290,138.6010);

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
          }
          //Center the camera at the specified location
          // 'camera': {
          //   'latLng': location,
          //   'tilt': 30,
          //   'zoom': 15,
          //   'bearing': 50
          // }
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

  updateSearch(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    let env = this;
    this.GooglePlaces.getPlacePredictions({ input: this.autocomplete.input }, function (predictions, status) {
      env.autocompleteItems = [];
      env.zone.run(function () {
        predictions.forEach(function (prediction) {
          env.autocompleteItems.push(prediction);
        });
      });
    });
  }

  chooseItem(item){
    let env = this;
    this.geocoder.geocode({'placeId': item.place_id}, function(results, status) {
      if(status === 'OK'){
        if(results[0]){
          let position: CameraPosition = {
            target: results[0].geometry.location,
            zoom: 18,
            tilt: 30
          }
          env.map.moveCamera(position);
        }
      }
    })
  }

}
