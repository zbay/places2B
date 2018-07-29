import { animate, state, style, transition, trigger } from '@angular/animations';

export const Animations = {
  slideUp: trigger('slideUp', [
    state(':enter', style({
      transform: 'scaleY(1)',
    })),
    state('hiding',   style({
      transform: 'scaleY(0)',
      display: 'inline'
    })),
    transition('* => *', animate('600ms ease-in'))
  ])
};
