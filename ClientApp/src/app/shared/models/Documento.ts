import { UserSession } from '../../login/models/user-session';

export class Documento {
    id: string;
    nombre: string;
    userSession?: UserSession | { usuario: string, password: string};
    owner?: boolean;
    propietario: string;
}

export interface ListaDocumentos {
    id: string;
    nombre: string;
    usuario: string;
    bites: string;
    detalle: string;
    fecha: string | Date;
    firmado: string;
    validado: string;
    propietario?: string;
    owner?: boolean;
}

export interface DocumentoCoordenada {
    id: string;
    UserSession: UserSession;
}

export class CoordenadasFirmante {
    id?: string;
    id_doc: string;
    firmante?: string;
    pagina: number;
    coordenadas?: Coordenada;
    coordenadaPDF?: Coordenada;
    coordenadaHTML?: Coordenada;
    onStoped?: boolean;
    isMoved?: boolean;
    saved?: boolean;
    isNew?: boolean;
    modified?: boolean;
    onInit?: boolean;
}

export class AgregarCoordenada {
    userSession?: UserSession | { usuario: string, password: string};
    id_doc?: string;
    usuarioFirma: string;
    pagina: number;
    coordenadaPDF: Coordenada;
}

export class AnulaCoordenada {
    userSession?: UserSession | { usuario: string, password: string};
    idf: any;
}

export interface Coordenada {
    x: number;
    y: number;
}


