import { Component,EventEmitter, Output } from '@angular/core';
import { Division } from '../../../models/division.model';
import { ColumnsMetadata } from '../../../models/columnMetaData';
import { DivisionService } from '../../../services/division.service';
import { MatDialog } from '@angular/material/dialog';
import { Data, Router } from '@angular/router';
import { PopupContentComponent } from '../../helper/popup/popup.component';
import { ApiResponse } from '../../../models/response';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-division-table',
  templateUrl: './division-table.component.html',
  styleUrls: ['./division-table.component.scss']
})
export class DivisionTableComponent {
 
  @Output() sendDataEvnt = new EventEmitter<number>();
  divisionMetaData: { content: Array<Division>; totalElements: number } = {
    content: [],
    totalElements: 0,
  };
  divisionHeaders: { columnsMetadata: Array<ColumnsMetadata> } = {
    columnsMetadata: [],
  };
 


  constructor(private divisionService: DivisionService,  private router: Router,
    private dialog: MatDialog) {}

  ngOnInit(): void {
   this.getHeaders();
    let params = new HttpParams();
    params = params.set('page', 0);
    params = params.set('size', 10);
    this.searchFunction(params);
  }


  getHeaders() {
    this.divisionService.getDivisionHeaders().subscribe(  
      (response: { columnsMetadata: Array<ColumnsMetadata> }) => {
      this.divisionHeaders = response;
      console.log(this.divisionHeaders);
    },
    (error: any) => {
      console.error('GET Request failed', error);
    });
  }
  action(event: Data) {
    let type: string = event['event'];
     let id: string = event['data'].divisionId;
    const queryParam = { id: id };
    switch (type) {
      case 'delete':
        this.divisionService.deleteDivision(event['data'].divisionId).subscribe(
          (response: ApiResponse) => {
            console.log('DELETE-Division Request successful', response);
         
            this.divisionService.notify('Division Delete successfully..!');
            let params = new HttpParams();

            params = params.set('page', 0);

            params = params.set('size', 10);
            this.searchFunction(params);
          },
          (error: any) => {
            console.error('DELETE-Division Request failed', error);
          }
        );
        break;
      case 'add':
        this.router.navigate(['/master/division']);
        break;

        case 'edit':
          if (event['data'].divisionId == undefined)
          this.divisionService.warn('Please select Id for the operation');
          this.router.navigate(['/master/division'], { queryParams: queryParam });
          break;
    }
  }

  openPopup(message: string) {
    this.dialog.open(PopupContentComponent, {
      width: '600px',
      height: '200px',
      data: { message: message },
    });
  }
    searchFunction(event: HttpParams) {
    this.divisionService
      .search(event)
      .subscribe((data: { content: Array<Division>; totalElements: number }) => {
        console.log(data.content);
        console.log(data.totalElements);
        this.divisionMetaData = data;
      });
}
}
