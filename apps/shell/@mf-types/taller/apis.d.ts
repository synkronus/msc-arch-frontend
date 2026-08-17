
    export type RemoteKeys = 'taller/App';
    type PackageType<T> = T extends 'taller/App' ? typeof import('taller/App') :any;