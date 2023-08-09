import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { ColumnsMetadata } from 'src/app/modules/master/models/columnMetaData';
import { Pagination } from 'src/app/modules/master/models/pageable';
import { RoleService } from 'src/app/modules/master/services/role.service';
import { HttpClient, HttpParams } from '@angular/common/http';
// import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { debounceTime } from 'rxjs';
import { Role } from 'src/app/modules/master/models/role.model';
import { EmployeeTypeService } from 'src/app/modules/master/services/employee-type.service';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
})
export class DatatableComponent implements OnInit, OnChanges {
  @Input() dataSource!: Array<Object>;
  @Input() headers!: Array<ColumnsMetadata>;
  @Input() totalRecord: number = 0;
  @Output() deleteFunction: EventEmitter<Object> = new EventEmitter();
  @Output() buttonFunction: EventEmitter<Object> = new EventEmitter();
  @Output() paginationParams: EventEmitter<HttpParams> = new EventEmitter();

  @ViewChild('confrimationmodel') confrimationmodel!: ElementRef;
  @ViewChild('addFormModel') addFormModel!: ElementRef;
  paginationList: Array<number> = [];
  selectedValue!: Object;
  searchTerm!: string;
  key: string = 'id';
  reverse: boolean = false;
  // data: any;
  pagination: Pagination = { pageSize: 10, pageNumber: 0 };
  constructor(private roleService: RoleService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.setPagination();
  }

  ngOnInit(): void {
    this.searchFunction();
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
        data.data = this.selectedValue;
        if (data.data == undefined)
          this.roleService.warn('Please select record to edit');
        else return this.buttonFunction.emit(data);
        break;

      case 'delete':
        data.data = this.selectedValue;
        if (data.data == undefined)
          this.roleService.warn('Please select record to delete');
        if (data.data != undefined) {
          this.confrimationmodel.nativeElement.click();
        }

        break;
    }
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
    let totalPages = Math.ceil(this.totalRecord / this.pagination.pageSize);
    for (let i = 0; i < totalPages; i++) {
      this.paginationList.push(i);
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
    this.pagination.pageNumber = page + 1;
    this.setHttpParams();
  }

  prevPage(page: number) {
    if (page != 0) {
      console.log('Page>> ' + page);
      this.pagination.pageNumber = page - 1;
      this.setHttpParams();
    } else {
      console.log('Page>> ' + page);

      this.pagination.pageNumber = page;
      this.setHttpParams();
    }
  }
}
