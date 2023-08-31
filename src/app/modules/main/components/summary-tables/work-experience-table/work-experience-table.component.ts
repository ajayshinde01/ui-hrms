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
  buttonVisible: Array<boolean> = [true, true, true];
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

  params: HttpParams = new HttpParams(); // Create an instance of HttpParams

  constructor(
    private workExperienceService: WorkExperienceService, // Update the service name

    private route: ActivatedRoute,

    private matDialog: MatDialog,

    private toastrService: ToastrService // Update the service name
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params['id'];
    });

    this.getHeaders();

    let params = new HttpParams(); // Create an instance of HttpParams

    params = params.set('page', '0'); // Set page as a string

    params = params.set('size', '10'); // Set size as a string

    this.searchFunction(params);
  }

  getHeaders() {
    this.workExperienceService

      .fetchWorkExperienceHeaders() // Update the service method name

      .subscribe(
        (response: { columnsMetadata: Array<ColumnsMetadata> }) => {
          this.workExperienceHeaders = response;
        },

        (error: any) => {
          console.error('GET Request failed', error);
        }
      );
  }

  action(event: any) {
    let type: string = event['event'];

    let id: string = event['data'].id;

    const queryParam = { workExperienceId: id }; // Update the query parameter name

    switch (type) {
      case 'delete':
        this.workExperienceService // Update the service name

          .deleteWorkExperience(event['data'].id, this.id) // Update the service method name and parameters

          .subscribe(
            (response: ApiResponse) => {
              console.log(
                'DELETE-Work Experience Request successful',
                response
              );

              this.toastrService.success(
                'Work Experience deleted successfully'
              ); // Update the service name

              this.searchFunction(this.params);

              const currentPage = Number(this.params.get('page'));

              if (
                this.workExperiencesMetaData.content.length === 1 &&
                currentPage > 0
              ) {
                const newPage = currentPage - 1;

                this.params = this.params.set('page', newPage.toString());

                this.searchFunction(this.params);
              }
            },

            (error: any) => {
              console.error('DELETE-Work Experience Request failed', error);
            }
          );

        break;

      case 'add':
        this.openModal(); // Update the method name

        break;

      case 'edit':
        this.openModalForEdit(id, this.id); // Update the method name and parameters

        break;
    }
  }

  searchFunction(params: HttpParams) {
    this.params = params;

    this.workExperienceService

      .searchWorkExperiences(params, this.id) // Call the method with parameters like this

      .subscribe(
        (data: { content: Array<WorkExperience>; totalElements: number }) => {
          console.log(data.content);

          console.log(data.totalElements);

          this.workExperiencesMetaData = data;
        }
      );
  }

  openModal() {
    this.matDialogRef = this.matDialog.open(
      WorkExperienceFormComponent, // Update the component name

      {
        data: {
          id: this.id,
        },

        disableClose: true,
      }
    );

    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);

      if (res == true) {
        // Do something if necessary
      }
    });
  }

  openModalForEdit(data: string, id: number) {
    debugger;

    this.matDialogRef = this.matDialog.open(
      WorkExperienceFormComponent, // Update the component name

      {
        data: {
          workExperienceId: data, // Update the property name

          id: id,
        },

        disableClose: true,
      }
    );

    this.matDialogRef.afterClosed().subscribe((res: any) => {
      this.searchFunction(this.params);

      if (res == true) {
        // Do something if necessary
      }
    });
  }
}
