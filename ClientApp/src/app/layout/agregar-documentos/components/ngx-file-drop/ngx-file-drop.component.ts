import { Component, ViewChild, Output, EventEmitter, TemplateRef,  ElementRef, OnDestroy, OnInit } from '@angular/core';
import { UploadEvent, FileSystemFileEntry } from 'ngx-file-drop';
import { DocumentoService } from '../../../../shared/services/documento';
import { UploadFile } from './models/upload-file.models';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ResponseMessage } from '../../../../shared/interfaces/response-message';
import { FormGroup, FormBuilder, Validators, FormControl, } from '@angular/forms';
import { Subscription, Observable, Subject } from 'rxjs';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-filedrop',
  templateUrl: './ngx-filedrop.component.html',
  styleUrls: ['./ngx-filedrop.component.scss']
})
export class NgxFileDropComponent implements OnInit, OnDestroy {

  public UploadFile: UploadFile = new UploadFile();
  private maxSize = 1024000 * 15; // max 15 MB

  public alertMsg = '';
  public alertShown = false;
  public bsModalRef: BsModalRef;
  public DestinatarioModalRef: BsModalRef;
  public title: string;
  public content: string;

  public buttonSave = false;
  public buttonRemove = false;
  public sendingFile = false;

  FormDestinatario: FormGroup;
  destinatarioCtrl: FormControl;

  GuardarSubscription: Subscription;
  Message: any;
  MessageFormat: string;
  interval: NodeJS.Timeout;
  userValid: boolean;
  showSpinner: boolean;

  constructor(private service: DocumentoService,
              private modalService: BsModalService,
              private formBuilder: FormBuilder) {

  }

  @ViewChild('messageModal') modalTemplate: TemplateRef<any>;
  @ViewChild('DestinatarioModal') modalDestinatarioTemplate: TemplateRef<any>;
  @ViewChild('fileInput') fileInput: ElementRef;

  destinatario: ElementRef;

  @Output() EventDocumentoGuardado = new EventEmitter();

  @Output() reload = new EventEmitter();

  ngOnInit(): void {

  }

  dropped(event: UploadEvent) {

    for (const droppedFile of event.files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile === true && droppedFile.fileEntry.isDirectory === false) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          if (file.type === 'application/pdf' && (file.size <= this.maxSize) && (file.size > 0) ) {
            this.UploadFile.setDataFile(file);
            this.alertShown = false;
            this.activeButton(true);
          } else {
            this.alertMsg = 'Formato de archivo no permitido, debe ser PDF';
            this.UploadFile.cleanFile();
            this.alertShown = true;
            this.activeButton(false);
          }
        });
      } else {
        console.warn('is empty directories are added, otherwise only files !!!');
      }
    }
    console.log(this.buttonSave);
  }

  onFileInputChange(fileList: File[]): void {
    for (const file of fileList) {
        if (file.type === 'application/pdf' && file.size <= this.maxSize) {
          this.UploadFile.setDataFile(file);
          this.alertShown = false;
          this.activeButton(true);
        } else {
          this.alertShown = true;
          this.alertMsg = 'Formato de archivo no permitido, debe ser PDF';
          this.UploadFile.cleanFile();
          this.activeButton(false);
        }
    }
  }

  openDestinatarioModal() {
    const unamePattern = '^[a-zA-Z0-9]*$';
    this.FormDestinatario = this.formBuilder.group({ destinatario: this.destinatarioCtrl });

    this.destinatarioCtrl = this.formBuilder.control('',
                                                      [ Validators.required,
                                                        Validators.pattern(unamePattern),
                                                        Validators.maxLength(15),
                                                        // Validators.minLength(1)
                                                      ]);

    const initialState = {
        content: 'prueba'
    };
    this.DestinatarioModalRef = this.modalService
                                    .show(this.modalDestinatarioTemplate,
                                          {
                                            initialState,
                                            class: 'gray modal-md',
                                            backdrop: 'static',
                                            keyboard: false
                                          });
  }

  guardarDocumento(e?: any): void {

    if (this.destinatarioCtrl.valid && this.UploadFile.size > 0 && this.userValid) {
      this.sendingFile = true;
      const formData = new FormData();
      formData.append('file', this.UploadFile.getfile, this.UploadFile.name);
      formData.append('DescFile', '');
      formData.append('usuarioDestino', this.destinatarioCtrl.value);
      this.GuardarSubscription =
      this.service
            .Guardar(formData)
            .subscribe(
                      (response: ResponseMessage) => {
                          this.DestinatarioModalRef.hide();
                          this.EventDocumentoGuardado.emit(true);
                          const message = `<p class="txt-bold">Documento guardado con el nombre: <span>${response.Nombre}</span></p>`;
                          this.openModal(message, 'Signar - Aviso');
                      },
                      error => {
                          this.removeFile();
                          this.DestinatarioModalRef.hide();
                          this.openModal('no se puede atender su solicitud', 'Signar - Aviso');
                          console.log(error);
                      },
                      () => {
                          console.log('documentoService.Guardar complete');
                          this.removeFile();
                          this.activeButton(false);
                          this.sendingFile = false;
                      }
            );
    }
  }

  validarUsuario(usuario: string) {
    this.service.ValidaUsuario(usuario)
                .subscribe( (response: any) => {
                    if (response === 'OK') {
                      this.userValid = true;
                    } else if (response.state === 0) {
                      this.Message = response.message;
                      this.userValid = false;
                    }
                    this.showSpinner = false;
                });
  }

  onKey(usuario: string, event?: any) {

    this.userValid = false;

    if (usuario.length > 0) {
      this.showSpinner = true;
    } else {
      this.showSpinner = false;
    }

    if (this.interval) {
      clearInterval(this.interval); // Al escribir, limpio el intervalo
    }
    this.interval = setInterval( () => { // Y vuelve a iniciar
        // Cumplido el tiempo, se muestra el mensaje
        if (this.destinatarioCtrl.valid) {
          // console.log('string VALIDO');
          this.validarUsuario(usuario);
        }
        clearInterval(this.interval); // Limpio el intervalo
    }, 500);
  }

  openModal(message: string, title: string = 'Signar') {
    this.content = message;
    this.title = title;
    const initialState = {
        title: title,
        content: message
    };
    this.bsModalRef = this.modalService.show(this.modalTemplate, {
                                                                  initialState,
                                                                  class: 'gray modal-md'});
  }

  reloadDatatable() {
    this.bsModalRef.hide();
  }

  public fileOver(event) {
    console.log(event);
  }

  public removeFile() {
    this.UploadFile.cleanFile();
    this.fileInput.nativeElement.value = '';
    this.alertShown = false;
    this.activeButton(false);
  }

  activeButton(state: boolean = false): void {
    this.buttonSave = this.buttonRemove = state;
  }

  ngOnDestroy(): void {
    this.removeFile();
    if (this.GuardarSubscription) {
      this.GuardarSubscription.unsubscribe();
    }
  }

}
