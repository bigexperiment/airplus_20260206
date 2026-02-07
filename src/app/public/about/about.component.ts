import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SiteContentService } from '../../services';
import {
  SiteContent,
  AboutHeroContent,
  AboutStoryContent,
  ValueItem,
  TeamMember,
  WhyChooseItem,
  CertificationItem,
  AboutCTAContent,
  CompanyInfo
} from '../../models';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, OnDestroy {
  aboutHero!: AboutHeroContent;
  aboutStory!: AboutStoryContent;
  aboutValues: ValueItem[] = [];
  teamMembers: TeamMember[] = [];
  whyChooseUs: WhyChooseItem[] = [];
  certifications: CertificationItem[] = [];
  aboutCta!: AboutCTAContent;
  company!: CompanyInfo;
  private sub!: Subscription;

  constructor(private siteContentService: SiteContentService) {}

  ngOnInit(): void {
    this.sub = this.siteContentService.content$.subscribe(content => {
      this.aboutHero = content.aboutHero;
      this.aboutStory = content.aboutStory;
      this.aboutValues = content.aboutValues;
      this.teamMembers = content.teamMembers;
      this.whyChooseUs = content.aboutWhyChooseUs;
      this.certifications = content.certifications;
      this.aboutCta = content.aboutCta;
      this.company = content.companyInfo;
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
