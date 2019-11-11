import {Component, HostListener, Input, OnInit} from '@angular/core';
import {Language} from '../interface/language.model';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})

export class DropdownComponent implements OnInit {
  @Input() _automation: Language[];
  @Input() _monitors: Language[];

  private automation: Language[];
  private monitors: Language[];
  private dropdownActive = false;
  private search = '';
  private searchUpdate = new Subject<string>();
  private visibleElements = 50;
  private scrollStep = 1;

  constructor() {
  }

  ngOnInit() {
    this.automation = this._automation;
    this.monitors = this.sliceArray(this._monitors);

    // Debounce search.
    this.searchUpdate
      .pipe(
        debounceTime(400)
      )
      .subscribe((query) => {
        this.automation = this.filterLanguages(this._automation, query);
        this.monitors = this.sliceArray(
          this.filterLanguages(this._monitors, query)
        );
      });
  }

  private filterLanguages(array, query) {
    if (query !== '') {
      return array.filter(item => item.name.includes(query));
    } else {
      return array;
    }
  }

  onChangeSearch(event) {
    this.scrollStep = 1;
    this.searchUpdate.next(event);
  }

  onSelectItem(name: string) {
    this.search = name;
    this.close();
  }

  arrowToggle() {
    if (this.dropdownActive) {
      this.clearSearch();
      this.close();
    } else {
      document.getElementById('inputSearch').focus();
    }
  }

  clearSearch() {
    if (!this._automation.find(item => item.name === this.search)
      && !this._monitors.find(item => item.name === this.search)) {
      this.search = '';
    }
  }

  close() {
    this.dropdownActive = false;
    this.searchUpdate.next(this.search);
  }

  sliceArray(array) {
    return array.slice(0, this.visibleElements * this.scrollStep);
  }

  @HostListener('document:click', ['$event'])
  onBackdropClick(event) {
    if (this.dropdownActive && !event.path.find(item => item.className === 'dropdown')) {
      this.clearSearch();
      this.close();
    }
  }

  @HostListener('scroll', ['$event'])
  scrollHandler(event) {
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight
      && this.monitors.length >= this.visibleElements * this.scrollStep) {
      this.scrollStep++;
      this.searchUpdate.next(this.search);
    }
  }
}
