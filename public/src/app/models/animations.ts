import { animate, state, style, transition, trigger } from '@angular/animations';

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
  scaleHorizAndFadeIn: trigger('scaleHorizAndFadeIn', [
    transition(':enter', [
      style({
        transform: 'scaleX(0)',
        opacity: 0
      }),
      animate('300ms 300ms', style({
        transform: 'scaleX(1)',
        opacity: 1
      }))
    ]),
    transition(':leave', [
      style({
        transform: 'scaleX(1)',
        opacity: 1
      }),
      animate(300, style({
        transform: 'scaleX(0)',
        opacity: 0
      }))
    ])
  ]),
  scaleVertFadeSwap: trigger('scaleVertFadeSwap', [
    state('showing', style({
      opacity: 1,
      transform: 'scaleY(1)'
    })),
    state('hidden',   style({
      opacity: 0,
      transform: 'scaleY(0)'
    })),
    transition('showing => hidden', animate('300ms ease-in')),
    transition('hidden => showing', animate('300ms ease-out'))
  ])
};
