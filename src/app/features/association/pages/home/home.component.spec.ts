import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Association } from '../../models/association.model';
import { AssociationService } from '../../services/association.service';
import { MeService } from '../../services/me.service';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  let meService: jasmine.SpyObj<MeService>;
  let associationService: jasmine.SpyObj<AssociationService>;

  const mockAssociation: Association = {
    name: 'Mock Association',
    description: 'This is a mock association'
  };

  beforeEach(async () => {
    meService = jasmine.createSpyObj('MeService', ['getAssociations']);
    associationService = jasmine.createSpyObj('AssociationService', ['getAssociation']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: MeService, useValue: meService },
        { provide: AssociationService, useValue: associationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the first association on initialization', () => {
    meService.getAssociations.and.returnValue(of([1]));
    associationService.getAssociation.and.returnValue(of(mockAssociation));

    component.ngOnInit();
    fixture.detectChanges();

    expect(meService.getAssociations).toHaveBeenCalled();
    expect(associationService.getAssociation).toHaveBeenCalledWith(1);
    expect(component.association).toEqual(mockAssociation);
  });

  it('should not load an association if no associations are returned', () => {
    meService.getAssociations.and.returnValue(of([]));

    component.ngOnInit();
    fixture.detectChanges();

    expect(meService.getAssociations).toHaveBeenCalled();
    expect(associationService.getAssociation).not.toHaveBeenCalled();
    expect(component.association).toBeNull();
  });
});
