import { FormControl } from '@angular/forms';

export function SearchRadiusValidator(control: FormControl): {[key: string]: any} | null {
  const invalidRadius = isNaN(control.value) || control.value < 1 || control.value > 25;
  return invalidRadius ? {'radius': {value: control.value}} : null;
}
