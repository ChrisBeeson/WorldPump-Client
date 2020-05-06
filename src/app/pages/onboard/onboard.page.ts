import { Component, OnInit, AfterViewInit, ViewChild, HostBinding } from '@angular/core';

import { IonSlides, MenuController } from '@ionic/angular';


@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.page.html',
  styleUrls: [
    './styles/onboard.page.scss'
  ]
})
export class OnboardPage implements OnInit, AfterViewInit {
  slidesOptions: any = {
    zoom: {
      toggle: false // Disable zooming to prevent weird double tap zomming on slide images
    }
  };

  @ViewChild(IonSlides, { static: true }) slides: IonSlides;
  @HostBinding('class.first-slide-active') isFirstSlide = true;
  @HostBinding('class.last-slide-active') isLastSlide = false;

  constructor(public menu: MenuController) { }

  ngOnInit(): void {
    this.menu.enable(false);
  }

  ngAfterViewInit(): void {
    // ViewChild is set
    this.slides.isBeginning().then(isBeginning => {
      this.isFirstSlide = isBeginning;
    });
    this.slides.isEnd().then(isEnd => {
      this.isLastSlide = isEnd;
    });

    // Subscribe to changes
    
    this.slides.ionSlideWillChange.subscribe(changes => {

      changes.a = this.slides.getActiveIndex (currentSlide => {

        switch (currentSlide) {
          case 4:
            this.slides.lockSwipeToNext;
        }

      })
      console.log("Slider Changed to index:"+this.slides.getActiveIndex);



  }

  skipWalkthrough(): void {
    // Skip to the last slide
    this.slides.length().then(length => {
      this.slides.slideTo(length);
    });
  }
}
