import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface ITemplateConfig {
  layout: {
    variant: string; // options: Dark, Light & Transparent
    menuPosition: string; // options: Side, Top ('Side' for Vertical & 'Top' for Horizontal)
    customizer: {
      hidden: boolean; // options: true, false
    }
    navbar: {
      type: string; // options: Static & Fixed
    }
    sidebar: { // Options for Vertical Side menu
      collapsed: boolean; // options: true, false
      size: string; // Options: 'sidebar-lg', 'sidebar-md', 'sidebar-sm'
      backgroundColor: string; // Options: 'black', 'pomegranate', 'king-yna', 'ibiza-sunset', 'flickr', 'purple-bliss', 'man-of-steel', 'purple-love'
      backgroundImage: boolean; // Options: true, false | Set true to show background image
      backgroundImageURL: string;
    }
  };
}


@Injectable({
  providedIn: "root"
})
export class ConfigService {
  public templateConf: ITemplateConfig = this.setConfigValue();
  templateConfSubject = new BehaviorSubject<ITemplateConfig>(this.templateConf);
  templateConf$ = this.templateConfSubject.asObservable();

  constructor() { }

  setConfigValue() {
    return this.templateConf = {
      layout: {
        variant: "Light",
        menuPosition: "Side",
        customizer: {
          hidden: true
        },
        navbar: {
          type: 'Fixed'
        },
        sidebar: {
          collapsed: false,
          size: "sidebar-md",
          backgroundColor: "man-of-steel",
          backgroundImage: true,
          backgroundImageURL: "assets/img/sidebar-bg/01.jpg"
        }
      }
    };
  }

  applyTemplateConfigChange(tempConfig: ITemplateConfig) {
    this.templateConf = Object.assign(this.templateConf, tempConfig);
    this.templateConfSubject.next(this.templateConf);
  }

}
