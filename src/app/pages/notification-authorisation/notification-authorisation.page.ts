import { Component, OnInit, ViewChild } from '@angular/core';
import { MessagingService } from '../../services/messaging.service';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-notification-authorisation',
  templateUrl: './notification-authorisation.page.html',
  styleUrls: ['../onboard/styles/onboard.page.scss'],
})

export class NotificationAuthorisationPage implements OnInit {


  @ViewChild(IonSlides, { static: true }) slides: IonSlides;


  constructor(private messagingService:MessagingService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
  
    // Subscribe to changes
    
    this.slides.ionSlideWillChange.subscribe(changes => { 
      this.slides.getActiveIndex().then(index => {
        switch (index) {
          case 1: {
            this.slides.lockSwipes(true);
            this.messagingService.requestPermission().then(resolve => {
              this.slides.lockSwipes(false);
              this.slides.slideNext();
            })
          }
        }
     });

    }
    )
  }
}
