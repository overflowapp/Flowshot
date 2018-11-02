const JSZip = require('jszip');
import * as cuid from 'cuid';
import { SessionData } from '../types';
import Helpers from '../utils/Helpers';

export default class FileManager {
    public static get structure() {
        return {
            title: `Flowshot-${cuid.slug()}`,
            date: Date.now(),
            imageDir: 'assets',
            screens: [],
        };
    }

    public static zipFiles(files: SessionData[]) {
        console.log('Zipping files');
        const zip = new JSZip();
        const baseSructure = { ...FileManager.structure };

        zip.folder(baseSructure.imageDir);

        files.forEach((data: SessionData, i: number) => {
            const newScreenId = Helpers.genId();
            const imageName = `${newScreenId}.png`;
            zip.file(`${baseSructure.imageDir}/${imageName}`, Helpers.uriToBlob(data.screen.dataURI));

            baseSructure.screens.push({
                id: newScreenId,
                title: `${data.screen.tab} - ${Date.now()}`,
                source: imageName,
                size: { ...data.screen.dimensions },
                position: {
                    x: 0,
                    y: 0,
                },
                area: {
                    id: Helpers.genId(),
                    position: {
                        x: data.click.boundingRect.x * 2,
                        y: data.click.boundingRect.y * 2,
                    },
                    size: {
                        h: data.click.boundingRect.h * 2,
                        w: data.click.boundingRect.w * 2,
                    },
                },
            });
        });

        baseSructure.screens.forEach((screen, i) => {
            if (baseSructure.screens[i + 1]) {
                screen.area.destination = baseSructure.screens[i + 1].id;
            }
        });

        zip.file('data.json', JSON.stringify(baseSructure));

        zip.generateAsync({ type: 'blob' }).then(blob => {
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = `${baseSructure.title}.flow`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            a.remove();
        });
    }
}
