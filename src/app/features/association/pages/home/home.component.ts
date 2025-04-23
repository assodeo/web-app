import { Component, OnInit } from '@angular/core';

import { Association } from '../../models/association.model';
import { AssociationService } from '../../services/association.service';
import { MeService } from '../../services/me.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  association: Association | null = null;

  constructor(private readonly meService: MeService, private readonly associationService: AssociationService) {}

  ngOnInit() {
    this.meService.getAssociations()
      .subscribe((associations: number[]) => {
        if (associations.length > 0) {
          const associationId = associations[0];

          this.associationService.getAssociation(associationId)
            .subscribe((association: Association) => {
              this.association = association;
            });
        }
      });
  }
}
