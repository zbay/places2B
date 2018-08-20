import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultComponent } from './result.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@app/modules/shared/shared.module';
import { DestinationType } from '@models/enums';

describe('ResultComponent', () => {
  let component: ResultComponent;
  let fixture: ComponentFixture<ResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultComponent ],
      imports: [ NoopAnimationsModule, SharedModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultComponent);
    component = fixture.componentInstance;
    component.index = 1;
    component.destination = {
      id: '2',
      category: DestinationType.Nightlife,
      image_url: 'https://www.image.com/img2.jpg',
      loc: 'Location',
      name: 'Name 2',
      price: '$$',
      phone: '1234567891',
      rating: ['*', '*'],
      reviews: '1244',
      coordinates: {
        latitude: 1.1,
        longitude: 2.1
      },
      url: 'https://www.abc.com/'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
