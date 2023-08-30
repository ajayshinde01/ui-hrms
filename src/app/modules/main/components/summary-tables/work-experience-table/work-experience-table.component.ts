import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ActivatedRoute } from '@angular/router';

import { WorkExperience } from '../../../models/work-experience.model';

import { WorkExperienceService } from '../../../services/work-experience.service';

import { ColumnsMetadata } from '../../../models/columns-metadata';

import { ApiResponse } from '../../../models/response';

import { ToastrService } from 'ngx-toastr';

import { WorkExperienceFormComponent } from '../../forms/work-experience-form/work-experience-form.component';

import { HttpParams } from '@angular/common/http'; // Import HttpParams

@Component({
  selector: 'app-work-experience-table',

  templateUrl: './work-experience-table.component.html',

  styleUrls: ['./work-experience-table.component.scss'],
})
export class WorkExperienceTableComponent implements OnInit {
  @Output() sendDataEvnt = new EventEmitter<number>();

  matDialogRef: MatDialogRef<WorkExperienceFormComponent>;

  id: number;

  workExperienceHeaders: any;

  workExperiencesMetaData: {
    content: Array<WorkExperience>;

    totalElements: number;
  } = {
    content: [],

    totalElements: 0,
  };

  params: HttpParams = new HttpParams(); // Initialize HttpParams

  masterName: string = 'Work Experience';

  constructor(
    private workExperienceService: WorkExperienceService,

    private matDialog: MatDialog,

    private route: ActivatedRoute,

    private toastrService: ToastrService // Import ToastrService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = +params['id'];

      this.sendDataEvnt.emit(this.id);

      console.log(this.sendDataEvnt);
    });

    this.searchFunction(this.params);

    this.getHeaders();
  }

  getHeaders() {
    this.workExperienceService

      .fetchWorkExperienceHeaders()

      .subscribe(
        (response: { columnsMetadata: Array<ColumnsMetadata> }) => {
          this.workExperienceHeaders = response;

          console.log(this.workExperienceHeaders);
        },

        (error: any) => {
          console.error('GET Request for Headers failed', error);
        }
      );
  }

  action(event: any) {
    const type: string = event['event'];

    const id: string = event['data'].id;

    switch (type) {
      case 'add':
        this.openAddModal();

        break;

      case 'edit':
        this.openEditModal(parseInt(id, 10)); // Convert id to a number

        break;

      case 'delete':
        this.deleteWorkExperience(parseInt(id, 10)); // Convert id to a number

        break;

      // Add more cases as needed
    }
  }

  searchFunction(params: HttpParams) {
    this.params = params;

    this.workExperienceService

      .searchWorkExperiences(params, this.id)

      .subscribe(
        (data: {
          content: Array<WorkExperience>;

          totalElements: number;
        }) => {
          this.workExperiencesMetaData = data;
        },

        (error: any) => {
          console.error('Search failed', error);
        }
      );
  }

  openAddModal() {
    this.matDialogRef = this.matDialog.open(WorkExperienceFormComponent, {
      disableClose: true,
    });

    this.matDialogRef.afterClosed().subscribe((res: any) => {
      if (res === true) {
        this.searchFunction(this.params);
      }
    });
  }

  openEditModal(id: number) {
    this.matDialogRef = this.matDialog.open(WorkExperienceFormComponent, {
      data: { workExperienceId: id }, // Pass workExperienceId

      disableClose: true,
    });

    this.matDialogRef.afterClosed().subscribe((res: any) => {
      if (res === true) {
        this.searchFunction(this.params);
      }
    });
  }

  deleteWorkExperience(id: number) {
    this.workExperienceService.deleteWorkExperience(id, this.id).subscribe(
      (response: ApiResponse) => {
        console.log('Work experience deleted', response);

        this.toastrService.success('Work experience deleted successfully');

        this.searchFunction(this.params);
      },

      (error: any) => {
        console.error('Delete failed', error);

        this.toastrService.error(
          'An error occurred while deleting work experience'
        );
      }
    );
  }
}
