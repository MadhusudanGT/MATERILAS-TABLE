import { Component, OnInit,ViewChild , Output , EventEmitter} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table'
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort'
import { MattableserviceService } from '../service/mattableservice.service';
import {SelectionModel} from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../components/shared/confirmation-dialog/confirmation-dialog.component';
import { element } from 'protractor';
@Component({
  selector: 'app-materials-table',
  templateUrl: './materials-table.component.html',
  styleUrls: ['./materials-table.component.css']
})
export class MaterialsTableComponent implements OnInit {
  displayedColumns = ['select','id', 'name', 'progress', 'color','update','action'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  constructor(private service:MattableserviceService,private route: ActivatedRoute,
    private router: Router,public dialog: MatDialog) { }
result:UserData[]=[];
@Output() SendValue: EventEmitter<any> = new EventEmitter<any>();
  ngOnInit(): void {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.result);

    this.service.getAll().subscribe((data:UserData[])=>
      {
        this.result=data;
        this.dataSource = new MatTableDataSource<UserData>(this.result);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // users.push(data as unknown as UserData)
        // console.log(this.result)
      })
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  selection = new SelectionModel<UserData>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

 data:UserData;
  // delete the row
//   delete(element){
//     this.data=element
// this.service.delete(this.data.id)
//       .subscribe(
//         response => {
//           console.log(response);
//           this.ngOnInit()
//           this.router.navigate(['/']);
//         },
//         error => {
//           console.log(error);
//         });
// }

//update the data
//@Output() SendValue=new EventEmitter<string>();


update(element) {
  console.log(element.data)
  this.SendValue.emit(element);
  this.ngOnInit();
  this.router.navigate(['/update-delete']);
 this.ngOnInit();
}

openDialog(element): void {
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '350px',
    data: "Do you confirm the deletion of this data?"
  });
  dialogRef.afterClosed().subscribe(result => {
    if(result) {
      console.log('Yes clicked');
      this.data=element;
        this.service.delete(this.data.id)
      .subscribe(
        response => {
          console.log(response);
          this.ngOnInit()
          this.router.navigate(['/']);
        },
        error => {
          console.log(error);
        });
      }
      // DO SOMETHING
  });
}
}

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}
