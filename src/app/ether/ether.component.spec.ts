import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtherComponent } from './ether.component';

describe('EtherComponent', () => {
  let component: EtherComponent;
  let fixture: ComponentFixture<EtherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
