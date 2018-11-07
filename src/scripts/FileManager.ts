import * as JSZip from 'jszip';
import * as cuid from 'cuid';
import Helpers from '../utils/Helpers';
import { Shot } from '../types/types';
import Flow from '../../Flow/src/typings/Flow';

export default class FileManager {
    private static get flowStructure(): Flow.File {
        return {
            document: {
                id: cuid(),
                name: 'Flowshot',
                type: Flow.Type.Document,
                children: [
                    {
                        id: cuid(),
                        name: `Flow ${cuid.slug()}`,
                        type: Flow.Type.Page,
                        backgroundColor: {
                            r: 0,
                            g: 0,
                            b: 0,
                            a: 1,
                        },
                        children: [],
                    },
                ],
            },
            settings: {},
            schemaVersion: 1,
        };
    }

    public static buildFile(files: Shot[]): Flow.File {
        const struct = { ...FileManager.flowStructure };
        const page = struct.document.children[0];
        const settings = { ...FileManager.exportSettings };
        let cumulativePosition = { x: 0, y: 0 };

        files.forEach((data: Shot) => {
            const newScreenId = cuid();
            const imageName = `${newScreenId}.${settings.imageExt}`;
            const screen = {
                id: newScreenId,
                name: `${data.tab.title} - ${cuid.slug()}`,
                source: {
                    dirPath: settings.assetFolder,
                    fileName: imageName,
                },
                children: [],
                size: { ...data.tab.size },
                position: { ...cumulativePosition },
                type: Flow.Type.Screen,
            } as Flow.Screen;

            if (data.event !== null) {
                const { x, y, w, h } = data.event.payload.boundingRect;
                screen.children.push({
                    id: cuid(),
                    name: null,
                    type: Flow.Type.Hotspot,
                    position: {
                        x: x * 2,
                        y: y * 2,
                    },
                    size: {
                        h: h * 2,
                        w: w * 2,
                    },
                    connections: [],
                } as Flow.Layer);
            }

            cumulativePosition.x += data.tab.size.w + settings.screenSpacing;
            page.children.push(screen);
        });

        page.children.forEach((screen: Flow.Screen, i) => {
            page.children[i + 1] &&
                screen.children[0].connections.push({
                    nodeID: page.children[i + 1].id,
                });
        });

        return struct;
    }

    public static zipFiles(files: Shot[]) {
        console.log(`Zipping ${files.length} files`);
        const zip = new JSZip();
        const struct = FileManager.buildFile(files);

        zip.folder(FileManager.exportSettings.assetFolder);
        zip.file('data.json', JSON.stringify(struct));

        struct.document.children[0].children.forEach((screen: Flow.Screen, i) => {
            zip.file(
                `${(screen.source as Flow.FileAsset).dirPath}/${(screen.source as Flow.FileAsset).fileName}`,
                Helpers.uriToBlob(files[i].tab.dataURI)
            );
        });

        zip.generateAsync({ type: 'blob' }).then(blob => {
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = `${struct.document.name}.flow`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            a.remove();
        });
    }

    private static readonly exportSettings = {
        assetFolder: 'assets',
        imageExt: 'png',
        screenSpacing: 200,
    };
}
