import { Component, ViewChild, Input, Output, ElementRef, EventEmitter, OnInit, OnDestroy, DoCheck, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, Subscription, BehaviorSubject, Subject } from 'rxjs';
import {
  PDFDocumentProxy, PDFPageProxy, PDFProgressData, PDFPromise, PDFPageViewport,
  PDFRenderTask, PDFJSStatic
} from 'pdfjs-dist';
import { Documento, CoordenadasFirmante, Coordenada, AgregarCoordenada, AnulaCoordenada } from '../models/Documento';
import { DocumentoService } from '../services/documento';
import { CoordenadasService } from './services/coordenadas.service';

import { SimpleProgressData, PageContainerUnique } from './pdf-viewer.models';
import { UserSessionService } from '../services/user-session/user-session.service';



let PDFJS: any;
let PDFJSWebViewer: any;

function isSSR() {
  return typeof window === 'undefined';
}

if (!isSSR()) {
  PDFJS = require('pdfjs-dist/build/pdf');
  PDFJSWebViewer = require('pdfjs-dist/web/pdf_viewer');
  PDFJS.verbosity = PDFJS.VerbosityLevel.ERRORS;
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
  providers: [
    CoordenadasService
  ]
})
export class PDFViewerComponent implements OnInit, OnDestroy, DoCheck {

  constructor(private element: ElementRef,
              private service: DocumentoService,
              private session: UserSessionService) {
    if (isSSR()) {
     return;
    }
    let pdfWorkerSrc: string;
    if (window.hasOwnProperty('pdfWorkerSrc') && typeof (window as any).pdfWorkerSrc === 'string' && (window as any).pdfWorkerSrc) {
       pdfWorkerSrc = (window as any).pdfWorkerSrc;
    } else {
       pdfWorkerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${(PDFJS as any).version}/pdf.worker.min.js`;
    }
    (PDFJS as any).GlobalWorkerOptions.workerSrc = pdfWorkerSrc;
  }

  private static readonly CSS_UNITS: number = 96.0 / 72.0; // screen DPI / PDF DPI
  private static readonly MAX_ZOOM = 1.75; // max. zoom 175%
  private static readonly MIN_ZOOM = 0.5; // min. zoom 50%
  private pdfDocument: PDFDocumentProxy;
  private pdfPage: PDFPageProxy;
  private PageViewport: PDFPageViewport;
  private currentViewport: PDFPageViewport;
  public pageContainerUnique: PageContainerUnique;

  public  numberPage = 1; // current page
  public  numPages = 1; // total
  public  zoom = 1.75;
  private heightTool = 50;

  @ViewChild('pageContainer') pageContainerRef: ElementRef;
  @ViewChild('canvas') canvasRef: ElementRef;
  @ViewChild('canvasWrapper') canvasWrapperRef: ElementRef;

  @Output() openModalAgregar = new EventEmitter<void>();
  @Output() openModalConfirm = new EventEmitter<void>();
  @Output() openModalValidar = new EventEmitter<void>();
  @Output() openModalMessage = new EventEmitter<string>();
  @Output() onError = new EventEmitter<Error>();

  @Input() Documento: Documento;
  @Input() Firmante = { nombre: '' };
  @Input() Firmado = { estado: '' };
  @Input() buttonAgregar = false;
  @Input() buttonFirmar = false;
  @Input() buttonValidar = false;
  @Input() CoordenadasService = false;

  public documentLoaded = false;
  public coordendasLoaded = false;
  public onReload = false;
  public progressBar = 0;
  public progressBarSuccess = false;
  public loadingContainer = true;
  public activeMenuToolBox = false;
  public savedPoint = 'no';
  public PointOnMove = false;
  public WaitingService = false;

  private ToolBoxCoordenadaHTML: Coordenada = { x: 0, y: 0 };
  private ToolBoxCoordenadaPDF: Coordenada = { x: 0, y: 0 };

  public ListaCoordenadas: CoordenadasFirmante[] = [];

  PageViewportSubject: Subject<PDFPageViewport> = new Subject<PDFPageViewport>();
  CanSignSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public CoordenadasHTMLSubject: BehaviorSubject<CoordenadasFirmante[]> = new BehaviorSubject<CoordenadasFirmante[]>([]);

  SubscribePageHeight: Subscription;
  SuscriptionCoordenadasHTML: Subscription;
  SubscriptionObtieneDocumento: Subscription;
  SubscriptionAgregaCoordenada: Subscription;
  SubscriptionAnulaCoordenada: Subscription;

  /**** angular dragg  config ****/
  inBounds = true;
  trackPosition = true;
  draggable = true;
  useHandle = false;
  showItemsTools = false;

  ngDoCheck() {
    if (this.Firmante.nombre) {
      this.addNewPointHTML();
      this.Firmante.nombre = null;
    }
    if (this.Firmado.estado === 'si') {
      this.reloadPDFJS();
    }
  }

  ngOnInit() {

    if (this.session.UserName === this.Documento.propietario) {
      this.draggable = true;
    } else {
      this.draggable = false;
    }

    this.pageContainerUnique = new PageContainerUnique();
    this.pageContainerUnique.element = this.pageContainerRef.nativeElement as HTMLElement;
    this.pageContainerUnique.canvasWrapper = this.canvasWrapperRef.nativeElement as HTMLCanvasElement;
    this.pageContainerUnique.canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    this.loadPDFJS();
    if (this.CoordenadasService) {
      this.SubscribePageHeight = this.getPageViewport()
                                     .subscribe((PageViewport: PDFPageViewport) => {
                                        this.CoordenadasHTML(PageViewport);
                                     });
    }

  }

  private scaleCoordenadaHTML(PageViewport: PDFPageViewport, coordenada: Coordenada): Coordenada {
    return {
        x: Math.round( coordenada.x * this.zoom ),
        y: Math.round( PageViewport.height - (coordenada.y * this.zoom) - this.heightTool )
    };
  }

  private CoordenadasHTML(PageViewport: PDFPageViewport): void {

    this.ListaCoordenadas = [];
    this.CoordenadasHTMLSubject.next(this.ListaCoordenadas);

    this.SuscriptionCoordenadasHTML =
    this.service
        .ObtieneCoordenadas(this.Documento as any)
        .subscribe((CoordenadasPDF: CoordenadasFirmante[]) => {
                    this.ListaCoordenadas = CoordenadasPDF;
                    this.ListaCoordenadas.map( item => {
                                                      item.coordenadaHTML = this.scaleCoordenadaHTML(PageViewport, item.coordenadaPDF);
                                                      item.isMoved = false;
                                                      item.onStoped = true;
                                                      item.modified = false;
                                                      item.onInit = true;
                                              });
                    this.CoordenadasHTMLSubject.next(this.ListaCoordenadas);
                    this.coordendasLoaded = true;
                    this.CheckCanSign();
                    },
                    error => {
                      console.log(error);
                    });
  }

  private CheckCanSign(): void {
    let countFirmante = 0;
    this.ListaCoordenadas
        .map((coordenada: CoordenadasFirmante) => {
            if (this.session.UserName === coordenada.firmante) {
              this.CanSignSubject.next(true);
              countFirmante++;
            }
        });
    if (countFirmante === 0) {
      this.CanSignSubject.next(false);
    }
  }

  private getPageViewport(): Observable<PDFPageViewport> {
    return this.PageViewportSubject.asObservable();
  }

  public getCanSignState(): Observable<boolean> {
    return this.CanSignSubject.asObservable();
  }

  public getCoordenadasHTML(): Observable<CoordenadasFirmante[]> {
    return this.CoordenadasHTMLSubject.asObservable();
  }

  private reloadPDFJS() {
    this.CoordenadasHTML(this.PageViewport);
    if (this.pdfDocument) {
      this.pdfDocument.destroy();
    }
    this.loadPDFJS();
    this.Firmado.estado = 'completed';
  }

  private loadPDFJS(): void {

   this.SubscriptionObtieneDocumento =
        this.service
            .ObtieneDocumento(this.Documento)
            .subscribe(
              (data: Blob) => {
                const loadingTask: any = (PDFJS as PDFJSStatic).getDocument(URL.createObjectURL(data));
                loadingTask.onProgress = (progressData: PDFProgressData) => {
                  this.setProgressData(new SimpleProgressData(progressData.loaded, data.size));
                };

                (<PDFPromise<PDFDocumentProxy>>loadingTask.promise)
                  .then((pdf: PDFDocumentProxy) => {
                    if (this.pdfDocument) {
                      this.pdfDocument.destroy();
                    }
                    this.pdfDocument = pdf;
                    this.numPages = pdf.numPages;
                    this.loadPage(this.numberPage);
                  }, (error: any) => {
                    this.onError.emit(error);
                  });
              },
              error => {
                this.onError.emit(error);
              }
            );
  }

  private loadPage(pageNum: number = 1): void {

    this.pdfDocument
        .getPage(pageNum)
        .then((thisPage: PDFPageProxy) => {
          this.pdfPage = thisPage;
          this.PageViewport = thisPage.getViewport(this.zoom);
          this.PageViewportSubject.next(this.PageViewport);
          this.PageViewportSubject.complete();
          this.renderPage(this.pdfPage);
        }).then(() => {// ===> succes promise
          if (this.SubscribePageHeight) {
            this.SubscribePageHeight.unsubscribe();
          }
        });
  }

  private renderPage(pdfPage: PDFPageProxy) {

    this.loadingContainer = false;

    const canvas: HTMLCanvasElement = this.pageContainerUnique.canvas;
    const wrapper: HTMLElement = this.pageContainerUnique.canvasWrapper;
    const canvasContext: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
    const page: HTMLElement = this.pageContainerUnique.element;
    canvasContext.imageSmoothingEnabled = false;

    this.currentViewport = pdfPage.getViewport(this.zoom);

    this.PageViewportSubject.next(this.currentViewport);

    canvas.width = this.currentViewport.width;
    canvas.height = this.currentViewport.height;
    page.style.width = `${this.currentViewport.width}px`;
    page.style.height = `${this.currentViewport.height}px`;
    wrapper.style.width = `${this.currentViewport.width}px`;
    wrapper.style.height = `${this.currentViewport.height}px`;

    // THIS RENDERS THE PAGE !!!!!!

    const viewport: PDFPageViewport = this.currentViewport;

    const renderTask: PDFRenderTask = pdfPage.render({
      canvasContext,
      viewport
    });

    renderTask.then(() => {
      this.documentLoaded = true;
      setTimeout(() => {
        this.progressBarSuccess = true;
        this.showItemsTools = true;
        this.onReload = false;
      }, 100);
    });
  }

  public ChangingZoom(zoom: number) {
    this.setZoom(zoom);
  }

  /**
   * Set the zoom of the document in double
   * @param scale The zoom value in double
   */
  private setZoom(scale: number): void {
    if (this.documentLoaded && typeof scale === 'number') {
      const normalizedScale = this.normalizeZOOM(scale);
      this.zoom = normalizedScale;
      this.renderPage(this.pdfPage);
    }
  }

  private normalizeZOOM(scale): number {
    let normalizeZOOM = scale;
    if (scale > PDFViewerComponent.MAX_ZOOM) {
      normalizeZOOM = PDFViewerComponent.MAX_ZOOM;
    } else if (scale < PDFViewerComponent.MIN_ZOOM) {
      normalizeZOOM = PDFViewerComponent.MIN_ZOOM;
    }
    return normalizeZOOM;
  }

  private scaleCoordenadaPDF(event: Coordenada): Coordenada {
    return {
            x: Math.round( event.x / this.zoom ),
            y: Math.round( (this.PageViewport.height - event.y - this.heightTool) / this.zoom )
    };
  }

  updateStateToolBox(): void {
    this.activeMenuToolBox = true;
  }

  changePage(amount: number) {
    this.onReload = true;
    this.showItemsTools = false;
    this.numberPage = this.getValidPageNumber(amount);
    this.loadPage(this.numberPage);
  }

  private setProgressData(loadingPDF: PDFProgressData) {
    this.progressBar = Math.round(loadingPDF.loaded / loadingPDF.total * 100);
  }

  SetPositionToolBox(event: Coordenada): void {
    console.log(this.zoom);
    this.ToolBoxCoordenadaHTML = {
                                   x: Math.round(event.x),
                                   y: Math.round(event.y)
    };

    this.ToolBoxCoordenadaPDF = this.scaleCoordenadaPDF(event);
    console.log('PDF: ', this.ToolBoxCoordenadaPDF);
    console.log('HTML: ', this.ToolBoxCoordenadaHTML);
  }

  onMovePointFirmante(event, index?) {

    this.ListaCoordenadas[index].coordenadaHTML = {
      x: Math.round(event.x),
      y: Math.round(event.y)
    };

    this.ListaCoordenadas[index].coordenadaPDF = this.scaleCoordenadaPDF(event);

    console.log('coordenadaHTML: ', this.ListaCoordenadas[index].coordenadaHTML);
    console.log('coordenadaPDF: ', this.ListaCoordenadas[index].coordenadaPDF);
    this.ListaCoordenadas[index].isMoved = true;
  }

  onStopPoint(index: number) {
    this.ListaCoordenadas[index].onStoped = true;
  }

  private addNewPointHTML(): void {
    try {
      const newPoint: CoordenadasFirmante = {
        id: '',
        id_doc: this.Documento.id,
        firmante: this.Firmante.nombre,
        pagina: this.numberPage,
        coordenadaHTML: this.ToolBoxCoordenadaHTML,
        saved: false,
        isMoved: false,
        isNew: true,
        onStoped: true,
      };
      this.ListaCoordenadas.push(newPoint);
      this.CoordenadasHTMLSubject.next(this.ListaCoordenadas);
      this.activeMenuToolBox = false;
      this.savedPoint = 'waiting';
    } catch (error) {
      console.log('%c addNewPointHTML(): ERROR:', 'color:red');
      console.log(error);
    }
  }

  private UpdatePoint(pointHTML: CoordenadasFirmante): void {
    const current = this.ListaCoordenadas.indexOf(pointHTML);
    if (current !== -1) {
      this.ListaCoordenadas.splice(current, 1);
      const coordenada: AgregarCoordenada = {
        id_doc: this.Documento.id.toString(),
        usuarioFirma: pointHTML.firmante,
        pagina: pointHTML.pagina,
        coordenadaPDF: pointHTML.coordenadaPDF
      };
      console.log(coordenada);
      this.service
          .AgregarCoordenada(coordenada)
          .subscribe((response: any) => {
            if (response.Message === 'OK') {
              const newPoint: CoordenadasFirmante = {
                id: response.id,
                id_doc: this.Documento.id,
                firmante: pointHTML.firmante,
                pagina: this.numberPage,
                coordenadaHTML: pointHTML.coordenadaHTML,
                coordenadaPDF: pointHTML.coordenadaPDF,
                isMoved: false,
                onStoped: true,
                modified: true
              };
              this.ListaCoordenadas.push(newPoint);
              this.CoordenadasHTMLSubject.next(this.ListaCoordenadas);
              this.CheckCanSign();
            }
          }, error => console.log(error),
          () => {
            this.savedPoint = 'completed';
            this.WaitingService = false;
            console.log(`Action: UpdatePoint completed`);
          });
    }
  }

  AnulaCoordenada(PointHTML: any): void {
    this.WaitingService = true;
    if (PointHTML.id) {
      this.ServiceAnulaCoordenada(PointHTML, 'delete');
    } else {
      setTimeout(() => {
        const currentIndex = this.ListaCoordenadas.indexOf(PointHTML);
        if (currentIndex !== -1) {
          this.ListaCoordenadas.splice(currentIndex, 1);
        }
        this.CoordenadasHTMLSubject.next(this.ListaCoordenadas);
        this.activeMenuToolBox = false;
        this.WaitingService = false;
        this.savedPoint = 'no';
      }, 250);
    }
  }

  AgregarCoordenada(PointHTML: CoordenadasFirmante): void {
    if (PointHTML.id) {
      this.ServiceAgregarCoordenada(PointHTML, 'update');
    } else {
      this.ServiceAgregarCoordenada(PointHTML, 'create');
    }
  }

  private ServiceAgregarCoordenada(PointHTML: CoordenadasFirmante, action: string): void {
    this.WaitingService = true;
    if (action === 'create') {
      const coordenada: AgregarCoordenada = {
        id_doc: this.Documento.id,
        usuarioFirma: PointHTML.firmante,
        pagina: PointHTML.pagina,
        coordenadaPDF: PointHTML.coordenadaPDF
      };
      console.log('agregar coordenda servide:', coordenada);
      this.service
          .AgregarCoordenada(coordenada)
          .subscribe(
              (response: any) => {
                if (response.Message === 'OK') {
                    const current = this.ListaCoordenadas.indexOf(PointHTML);
                    if (current !== -1) {
                      this.ListaCoordenadas[current].id = response.id;
                      this.ListaCoordenadas[current].onStoped = true;
                      this.ListaCoordenadas[current].isMoved = false;
                      this.ListaCoordenadas[current].modified = true;
                      this.CoordenadasHTMLSubject.next(this.ListaCoordenadas);
                      this.openModalMessage.emit(`Firmante <span class="text-red">${coordenada.usuarioFirma}</span> agregado al documento <span class="text-red">${this.Documento.nombre}</span>`);
                      this.savedPoint = 'completed';
                    } else {
                      console.log('%c service.AnulaCoordenada: ERROR', 'color:red');
                      console.error(response);
                      this.openModalMessage.emit('No se pudieron guardar los cambios');
                      this.savedPoint = 'no';
                    }
                    this.CheckCanSign();
                }
                console.log(response);
              }, error => {
                 console.log(`Action: ${action} Error: ${error}`);
                 this.savedPoint = 'no';
              }, () => {
                        this.WaitingService = false;
                        console.log(`Action: ${action} completed`);
              });
    } else if (action === 'update') {
      this.ServiceAnulaCoordenada(PointHTML, action);
    }
  }

  private ServiceAnulaCoordenada(pointHTML: any, action: string): void {
    const coordenada: AnulaCoordenada = {
      idf: pointHTML.id,
    };
    if (action === 'delete') {
      this.SubscriptionAnulaCoordenada =
      this.service
          .AnulaCoordenada(coordenada)
          .subscribe((response: any) => {
            if (response.Message === 'OK') {
              const current = this.ListaCoordenadas.indexOf(pointHTML);
              if (current !== -1) {
                this.ListaCoordenadas.splice(current, 1);
              }
              this.CoordenadasHTMLSubject.next(this.ListaCoordenadas);
              this.CheckCanSign();
            } else {
              console.log('%c service.AnulaCoordenada: ERROR', 'color:red');
              console.error(response);
              this.openModalMessage.emit('No se pudieron guardar los cambios');
            }
          }, error => {
            console.log(`Action: ${action} Error: ${error}`);
          }, () => {
            console.log(`Action: ${action} completed`);
            this.WaitingService = false;
          });
    }
    if (action === 'update') {
      this.SubscriptionAnulaCoordenada =
      this.service
          .AnulaCoordenada(coordenada)
          .subscribe((response: any) => {
            if (response.Message === 'OK') {
              this.UpdatePoint(pointHTML);
            } else {
              this.savedPoint = 'no';
              console.log('%c service.AnulaCoordenada: ERROR', 'color:red');
              console.error(response);
              this.openModalMessage.emit('No se pudieron guardar los cambios');
            }
          }, error => {
            console.log(error);
          },  () => {
            console.log(`Action: ${action} completed`);
            this.WaitingService = false;
          });
    }
  }

  ActiveToolBox(): void {
    this.activeMenuToolBox = !this.activeMenuToolBox;
  }

  public isActiveToolBox(): boolean {
    return this.activeMenuToolBox;
  }

  get isDocumentLoaded(): boolean {
    return this.documentLoaded;
  }

  private getValidPageNumber(page: number): number {
    if (page < 1) {
      return 1;
    }
    if (page > this.pdfDocument.numPages) {
      return this.pdfDocument.numPages;
    }
    return page;
  }

  openModal(filtro: string): void {
    switch (filtro) {
      case 'agregar':
        this.openModalAgregar.emit();
        break;
      case 'confirm':
        this.openModalConfirm.emit();
        break;
      case 'validar':
        this.openModalValidar.emit();
        break;
    }
  }

  ngOnDestroy(): void {
    if (this.pdfDocument) {
      this.pdfDocument.destroy();
    }
    if (this.SubscriptionObtieneDocumento) {
      this.SubscriptionObtieneDocumento.unsubscribe();
    }
    if (this.SuscriptionCoordenadasHTML) {
      this.SuscriptionCoordenadasHTML.unsubscribe();
    }
    if (this.SubscribePageHeight) {
      this.SubscribePageHeight.unsubscribe();
    }
    if (this.SubscriptionAgregaCoordenada) {
      this.SubscriptionAgregaCoordenada.unsubscribe();
    }
    if (this.SubscriptionAnulaCoordenada) {
      this.SubscriptionAnulaCoordenada.unsubscribe();
    }
    this.Firmante.nombre = null;
    this.Firmado.estado = '';
    this.ListaCoordenadas = [];
  }

}
