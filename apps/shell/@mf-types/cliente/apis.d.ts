
    export type RemoteKeys = 'cliente/App';
    type PackageType<T> = T extends 'cliente/App' ? typeof import('cliente/App') :any;