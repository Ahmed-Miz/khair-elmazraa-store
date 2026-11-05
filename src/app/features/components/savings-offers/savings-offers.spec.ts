import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingsOffers } from './savings-offers';

describe('SavingsOffers', () => {
  let component: SavingsOffers;
  let fixture: ComponentFixture<SavingsOffers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingsOffers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavingsOffers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
