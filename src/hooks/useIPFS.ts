import { useEffect, useState } from 'react';
import { createHelia, Helia } from 'helia';
import { unixfs, UnixFS } from '@helia/unixfs';

let heliaInstance: Helia | null = null;
let unixfsInstance: UnixFS | null = null;
let isInitializing = false;

export const useIPFS = () => {
    const [helia, setHelia] = useState<Helia | null>(heliaInstance);
    const [fs, setFs] = useState<UnixFS | null>(unixfsInstance);

    useEffect(() => {
        const init = async () => {
            if (heliaInstance || isInitializing) return;
            isInitializing = true;
            try {
                heliaInstance = await createHelia();
                unixfsInstance = unixfs(heliaInstance);
                setHelia(heliaInstance);
                setFs(unixfsInstance);
            } catch (err) {
                console.error("Failed to initialize Helia", err);
            } finally {
                isInitializing = false;
            }
        };

        init();
    }, []);

    return { helia, fs };
};
