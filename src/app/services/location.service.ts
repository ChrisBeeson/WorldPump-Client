import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { defaultThrottleConfig } from 'rxjs/internal/operators/throttle';
import { ProfileService } from '../pages/profile/profile.service';


@Injectable({
  providedIn: 'root'
})

export class LocationService {

  constructor(private profile:ProfileService) { }

  async updateLocation() {

    // get the current IP address
  
    // if the ip address is different from the one in the profile
    // request info
    // and update profile

    }
  }