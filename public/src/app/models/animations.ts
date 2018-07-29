import { animate, style, transition, trigger } from '@angular/animations';

export const Animations = {
  fadeIn: trigger('fadeIn', [
    transition('void => *', [
      style({
        opacity: 0
      }),
      animate(300, style({
        opacity: 1
      }))
    ]),
    transition('* => void', [
      style({
        opacity: 1
      }),
      animate(300, style({
        opacity: 0
      }))
    ])
  ])
};
