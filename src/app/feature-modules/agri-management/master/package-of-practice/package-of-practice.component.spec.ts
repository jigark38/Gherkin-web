import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PackageOfPracticeComponent } from './package-of-practice.component';

describe('PackageOfPracticeComponent', () => {
  let component: PackageOfPracticeComponent;
  let fixture: ComponentFixture<PackageOfPracticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageOfPracticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageOfPracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
