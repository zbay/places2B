import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorDialogComponent } from './error-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MaterialModule } from '@app/modules/material/material.module';
import { DebugElement } from '@angular/core';

describe('ErrorDialogComponent', () => {
  let component: ErrorDialogComponent;
  let fixture: ComponentFixture<ErrorDialogComponent>;
  let debugElement: DebugElement;
  let closeSpy;
  const MESSAGE = 'Testing 123';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorDialogComponent ],
      imports: [MaterialModule],
      providers: [{provide : MatDialogRef, useValue : {close: () => {}}},
        {provide: MAT_DIALOG_DATA, useValue: {message: MESSAGE}}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorDialogComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    const matDialogRef = debugElement.injector.get(MatDialogRef);
    closeSpy = spyOn(matDialogRef, 'close').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.message).toBe(MESSAGE);
  });

  it('should close', () => {
    component.close();
    expect(closeSpy).toHaveBeenCalled();
  });
});
