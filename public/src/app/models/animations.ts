import { animate, style, transition, trigger } from '@angular/animations';

export const Animations = {
  fadeIn: trigger('fadeIn', [
    transition(':enter', [
      style({
        opacity: 0
      }),
      animate(300, style({
        opacity: 1
      }))
    ]),
    transition(':leave', [
      style({
        opacity: 1
      }),
      animate(300, style({
        opacity: 0
      }))
    ])
  ]),
  fadeSwap: trigger('fadeSwap', [
    transition('* => beginSwap', [
      style({
        opacity: 1,
        transform: 'scaleY(1)'
      }),
      animate(300, style({
        opacity: 0,
        transform: 'scaleY(0)'
      }))
    ]),
    transition('* => finishSwap', [
      style({
        opacity: 0,
        transform: 'scaleY(0)'
      }),
      animate(300, style({
        opacity: 1,
        transform: 'scaleY(1)'
      }))
    ])
  ])
};
