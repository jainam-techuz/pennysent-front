import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  ViewChild,
  ElementRef,
  Renderer2
} from "@angular/core";
import { Subscription } from "rxjs";
import { ConfigService } from "../services/config.service";
import { CustomizerService } from '../services/customizer.service';

@Component({
  selector: "app-customizer",
  templateUrl: "./customizer.component.html"
})
export class CustomizerComponent implements OnDestroy {

  size: string;
  isBgImageDisplay: boolean = true;
  isOpen = true;
  layoutSub: Subscription;
  public config: any = {};
  @ViewChild("customizer") customizer: ElementRef;

  constructor(
    private renderer: Renderer2,
    private configService: ConfigService,
    public customizerService: CustomizerService,
  ) {
    this.config = this.configService.templateConf;
    this.isOpen = !this.config.layout.customizer.hidden;
    if (this.config.layout.sidebar.size) this.size = this.config.layout.sidebar.size;
  }

  @Output() directionEvent = new EventEmitter<Object>();

  changeSidebarWidth(value) {
    this.size = value;
    this.customizerService.changeSidebarWidth(value);
  }

  toggleCustomizer() {
    if (this.isOpen) {
      this.renderer.removeClass(this.customizer.nativeElement, "open");
      this.isOpen = false;
    } else {
      this.renderer.addClass(this.customizer.nativeElement, "open");
      this.isOpen = true;
    }
  }

  closeCustomizer() {
    this.renderer.removeClass(this.customizer.nativeElement, "open");
    this.isOpen = false;
  }

  bgImageDisplay(e) {
    if (e.target.checked) {
      this.isBgImageDisplay = true;
    } else {
      this.isBgImageDisplay = false;
    }
    this.customizerService.bgImageDisplay(e);
  }


  ngOnDestroy() {
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
  }

}
