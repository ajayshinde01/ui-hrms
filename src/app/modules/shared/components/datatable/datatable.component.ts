import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { ColumnsMetadata } from 'src/app/modules/master/models/columnMetaData';

import { Pagination } from 'src/app/modules/master/models/pageable';

import { HttpParams } from '@angular/common/http';

import { DataTableService } from './dataTable.service';
import { DeletePopupComponent } from '../../delete-popup/delete-popup.component';

// import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-datatable',

  templateUrl: './datatable.component.html',

  styleUrls: ['./datatable.component.scss'],
})
export class DatatableComponent implements OnInit, OnChanges {
  @Input() dataSource!: Array<Object>;

  @Input() buttonVisible: Array<boolean> = [false, false, false];

  @Input() headers!: Array<ColumnsMetadata>;

  @Input() totalRecord: number = 0;

  @Input() masterName: string;

  @Output() deleteFunction: EventEmitter<Object> = new EventEmitter();

  @Output() buttonFunction: EventEmitter<Object> = new EventEmitter();

  @Output() paginationParams: EventEmitter<HttpParams> = new EventEmitter();

  @ViewChild('confrimationmodel') confrimationmodel!: ElementRef;

  paginationList: Array<number> = [];

  selectedValue!: Object;

  searchTerm!: string;

  key: string = 'id';

  reverse: boolean = false;

  cardDivHeight: any = '';

  cardHeights!: number;

  pagination: Pagination = { pageSize: 10, pageNumber: 0 };

  constructor(
    private dataTableService: DataTableService,
    private dialog: MatDialog
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.setPagination();
    this.selectedValue = '';
  }

  ngOnInit(): void {
    this.searchFunction();
    this.cardHeight();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.cardHeight();
  }

  cardHeight() {
    this.cardHeights = window.innerHeight;

    this.cardDivHeight = this.cardHeights - 101;
  }

  getValue(rowObj: any, mappedBy: String) {
    const myArray = mappedBy.split('.');

    let value = rowObj[myArray[0]];

    if (value != null) {
      for (let i = 1; i < myArray.length; i++) {
        value = value[myArray[i]];
      }
    } else {
      value = '';
    }

    return value;
  }

  searchFunction() {
    this.pagination.serchingParmeter = this.searchTerm;

    this.setHttpParams();
  }

  radioButtonEvent(rowData: Object) {
    this.selectedValue = rowData;

    console.log(this.selectedValue.valueOf());
  }

  delete() {
    console.log('delete?');
    let data = { event: 'delete', data: {} };
    data.data = this.selectedValue;
    return this.deleteFunction.emit(data);
  }

  buttonEvent(event: string) {
    let data = { event: event, data: {} };
    switch (event) {
      case 'add':
        return this.buttonFunction.emit(data);
        break;

      case 'edit':
        if (this.selectedValue != '') {
          data.data = this.selectedValue;
        } else {
          this.dataTableService.notify('Please select record to edit');
          break;
        }
        if (data.data == undefined)
          this.dataTableService.notify('Please select record to edit');
        return this.buttonFunction.emit(data);
        break;

      case 'delete':
        if (this.selectedValue != '') {
          data.data = this.selectedValue;
        } else {
          this.dataTableService.notify('Please select record to delete');
          break;
        }
        if (data.data == undefined)
          this.dataTableService.notify('Please select record to delete');
        if (data.data != undefined) {
          this.handleDialog();
        }

        break;
    }
  }

  handleDialog() {
    const dialogRef = this.dialog.open(DeletePopupComponent, {
      width: '450px',
      panelClass: 'custom-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('User clicked Yes');
        this.delete();
      } else {
        console.log('User clicked No');
        // Perform the action you want after user clicks No or cancels the dialog
      }
    });
  }

  selectRow(rowData: any) {
    if (this.selectedValue === rowData) {
      this.selectedValue = '';
    } else {
      this.selectedValue = rowData;
    }
  }

  setHttpParams() {
    let params = new HttpParams();

    params = params.append('page', this.pagination.pageNumber);

    params = params.append('size', this.pagination.pageSize);

    this.pagination.sortKey
      ? (params = params.append(
          'sort',

          `${this.pagination.sortKey},${this.pagination.sortType}`
        ))
      : true;

    this.pagination.serchingParmeter
      ? (params = params.append('keyword', this.pagination.serchingParmeter!))
      : true;

    console.log(params);

    this.paginationParams.emit(params);
  }

  sort(sortBy: string) {
    if (sortBy != this.pagination.sortKey) {
      this.pagination.sortKey = sortBy;

      this.pagination.sortType = 'ASC';
    } else {
      this.pagination.sortKey = sortBy;

      if (this.pagination.sortType != 'DESC') {
        this.pagination.sortType = 'DESC';
      } else {
        this.pagination.sortType = 'ASC';
      }

      this.pagination.pageNumber = 0;
    }

    this.setHttpParams();
  }

  setPagination() {
    this.paginationList = [];

    const totalPages = Math.ceil(this.totalRecord / this.pagination.pageSize);
    const currentPage = this.pagination.pageNumber;

    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    if (currentPage > 2) {
      this.paginationList.push(0);
    }

    for (let i = startPage; i <= endPage; i++) {
      this.paginationList.push(i);
    }

    if (currentPage < totalPages - 3) {
      this.paginationList.push(totalPages - 1);
    }
  }

  changePage(page: number) {
    this.pagination.pageNumber = page;

    this.setHttpParams();
  }

  changePageSize() {
    this.setHttpParams();
  }

  nextPage(page: number) {
    let totalPages = Math.ceil(this.totalRecord / this.pagination.pageSize);
    console.log('total pages ' + totalPages);
    if (totalPages == page + 1) {
      this.pagination.pageNumber = page;
    } else {
      this.pagination.pageNumber = page + 1;
    }

    this.setHttpParams();
  }

  prevPage(page: number) {
    if (page != 0) {
      this.pagination.pageNumber = page - 1;

      this.setHttpParams();
    } else {
      console.log('Page>> ' + page);

      this.pagination.pageNumber = page;

      this.setHttpParams();
    }
  }
}
