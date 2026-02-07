import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SiteContentService } from '../../../services';
import { CompanyInfo, RepresentativeItem } from '../../../models';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  currentYear = new Date().getFullYear();
  company!: CompanyInfo;
  footerTagline = '';
  representatives: RepresentativeItem[] = [];
  private sub!: Subscription;

  constructor(private siteContentService: SiteContentService) {}

  ngOnInit(): void {
    this.sub = this.siteContentService.content$.subscribe(content => {
      this.company = content.companyInfo;
      this.footerTagline = content.footerTagline;
      this.representatives = content.representatives;
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
