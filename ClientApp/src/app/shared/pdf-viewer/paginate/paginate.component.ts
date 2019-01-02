import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'pdf-paginate',
  templateUrl: './paginate.component.html',
  styleUrls: ['./paginate.component.scss']
})
export class PaginateComponent implements OnInit {

  leftPageButton = false;
  rightPageButton = true;

  constructor() { }

  @Input() numberPage = 1;
  @Input() numPages = 1;

  public pageLoaded = false;

  @Input('DocumentLoaded')
  set DocumentLoaded(loadPage: boolean) {
    if (loadPage) {
      this.pageLoaded = true;
      this.updateButonPage();
    }
  }

  @Output() onChangePage = new EventEmitter<number>();

  ngOnInit() {
    this.updateButonPage();
  }

  changePage(amount: number) {
    this.numberPage += amount;
    this.onChangePage.emit(this.numberPage);
    this.updateButonPage();
  }

  private updateButonPage(): void {

    if (this.numberPage === 1) {
      this.leftPageButton = false;
    } else {
      this.leftPageButton = true;
    }
    if (this.numberPage === this.numPages) {
      this.rightPageButton = false;
    } else if (this.numPages > 1) {
      this.rightPageButton = true;
    }
  }

}
