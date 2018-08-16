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
      id: '1',
        category: DestinationType.Restaurants,
        image_url: 'https://www.image.com/img.jpg',
        loc: 'Loc',
        name: 'Name',
        price: '$',
        phone: '1234567890',
        rating: ['*'],
        reviews: '1243'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
